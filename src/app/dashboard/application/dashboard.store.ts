import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { DashboardApi } from '../infrastructure/dashboard-api';
import { EquipmentUsageStat } from '../domain/model/equipment-usage-stat.entity';
import { UsageSessionResource } from '../infrastructure/dashboard-response';
import { EquipmentStore } from '../../gym/application/equipment.store';
import { MaintenanceStore } from '../../maintenance/application/maintenance.store';

export interface HourlyCapacityPoint {
  hour:  string;
  value: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly api              = inject(DashboardApi);
  private readonly destroyRef       = inject(DestroyRef);
  private readonly equipmentStore   = inject(EquipmentStore);
  private readonly maintenanceStore = inject(MaintenanceStore);

  private readonly usageStatsSignal  = signal<EquipmentUsageStat[]>([]);
  private readonly sessionsSignal    = signal<UsageSessionResource[]>([]);
  private readonly loadingSignal     = signal(false);
  private readonly errorSignal       = signal<string | null>(null);

  readonly usageStats = this.usageStatsSignal.asReadonly();
  readonly loading    = this.loadingSignal.asReadonly();
  readonly error      = this.errorSignal.asReadonly();

  // ── KPI summary cards ─────────────────────────────────────────────────────
  readonly operationalCount = computed(() => this.equipmentStore.operationalCount());
  readonly maintenanceCount = computed(() => this.equipmentStore.maintenanceCount());
  readonly outOfOrderCount  = computed(() => this.equipmentStore.outOfServiceCount());
  readonly totalTickets     = computed(() => this.maintenanceStore.totalTickets());

  // ── Horas Pico de Capacidad — derived from usage_sessions ────────────────
  /**
   * Aggregates usage_sessions by hour-of-day and computes occupancy % as
   * (sessions_in_that_hour / max_sessions_in_any_hour) × 100.
   * Falls back to a default curve when the API has not returned sessions yet.
   */
  private readonly FALLBACK_CAPACITY: HourlyCapacityPoint[] = [
    { hour: '6:00',  value: 40 },
    { hour: '8:00',  value: 78 },
    { hour: '10:00', value: 52 },
    { hour: '12:00', value: 48 },
    { hour: '14:00', value: 98 },
    { hour: '16:00', value: 85 },
    { hour: '18:00', value: 75 },
    { hour: '20:00', value: 60 },
    { hour: '22:00', value: 35 },
  ];

  readonly hourlyCapacityData = computed<HourlyCapacityPoint[]>(() => {
    const sessions = this.sessionsSignal();

    const counts: Record<number, number> = {};
    for (const s of sessions) {
      const h = new Date(s.start_time).getHours();
      counts[h] = (counts[h] ?? 0) + 1;
    }

    if (Object.keys(counts).length < 4) {
      return this.FALLBACK_CAPACITY;
    }

    const maxCount = Math.max(...Object.values(counts), 1);

    return Object.entries(counts)
      .map(([h, c]) => ({
        hour:  `${h}:00`,
        value: Math.round((c / maxCount) * 100),
      }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
  });

  private readonly SVG_W = 680;
  private readonly SVG_H = 160;

  readonly linePoints = computed(() =>
    this.hourlyCapacityData().map((d, i) => ({
      x: (i / Math.max(this.hourlyCapacityData().length - 1, 1)) * this.SVG_W,
      y: this.SVG_H - (d.value / 100) * this.SVG_H,
      ...d,
    }))
  );

  readonly polylinePoints = computed(() =>
    this.linePoints().map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  );

  readonly areaPath = computed(() => {
    const pts = this.linePoints();
    if (!pts.length) return '';
    return (
      `M${pts[0].x},${this.SVG_H} ` +
      pts.map(p => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') +
      ` L${pts[pts.length - 1].x},${this.SVG_H} Z`
    );
  });

  // ── Uso de Máquinas (bar chart from API) ──────────────────────────────────
  readonly machineUsageBars = computed(() => {
    const stats      = this.usageStats();
    const equipments = this.equipmentStore.equipment();
    if (!stats.length || !equipments.length) return [];

    const maxHours = Math.max(...stats.map(s => s.totalUsageHours), 1);
    return stats.map(s => {
      const eq = equipments.find(e => e.uuid === String(s.equipmentId));
      return {
        name:    eq?.name ?? `Equipo #${s.equipmentId}`,
        hours:   s.totalUsageHours,
        pct:     (s.totalUsageHours / maxHours) * 100,
        wearPct: Math.round(s.estimatedWearLevel * 100),
      };
    });
  });

  readonly maxBarHours = computed(() =>
    Math.max(...this.machineUsageBars().map(b => b.hours), 600)
  );

  // ── Equipos Subutilizados ─────────────────────────────────────────────────
  readonly underutilizedEquipment = computed(() => {
    const stats      = this.usageStats();
    const equipments = this.equipmentStore.equipment();

    return stats
      .filter(s => s.totalUsageHours < 130)
      .map(s => {
        const eq   = equipments.find(e => e.uuid === String(s.equipmentId));
        const zone = 'Zona Fuerza';
        const roi: 'Bajo' | 'Medio' | 'Alto' =
          s.totalUsageHours < 80  ? 'Bajo'  :
          s.totalUsageHours < 110 ? 'Medio' : 'Alto';
        return {
          machineId: eq?.uuid.slice(0, 8) ?? String(s.equipmentId),
          name:      eq?.name ?? `Equipo #${s.equipmentId}`,
          location:  zone,
          hours:     `${s.totalUsageHours}h`,
          roi,
        };
      });
  });

  // ── Mantenimiento kanban ──────────────────────────────────────────────────
  readonly pendingTickets    = computed(() => this.maintenanceStore.pendingTickets());
  readonly inProgressTickets = computed(() => this.maintenanceStore.inProgressTickets());
  readonly resolvedTickets   = computed(() => this.maintenanceStore.resolvedTickets());

  ticketLabel(id: string): string {
    return `T-${id.slice(0, 8)}`;
  }

  equipmentName(equipmentId: string): string {
    return this.equipmentStore.equipment().find(e => e.uuid === equipmentId)?.name
      ?? equipmentId;
  }

  constructor() {
    this.load();
  }

  private load(): void {
    this.loadingSignal.set(true);
    forkJoin({
      stats:    this.api.getEquipmentUsageStats(),
      sessions: this.api.getUsageSessions(),
    })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: ({ stats, sessions }) => {
        this.usageStatsSignal.set(stats);
        this.sessionsSignal.set(sessions);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(err instanceof Error ? err.message : 'Error');
        this.loadingSignal.set(false);
      },
    });
  }
}
