import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AnalyticsApi } from '../../analytics/infrastructure/analytics-api';
import { AnalyticsStat } from '../../analytics/domain/model/analytics-stat.entity';
import { EquipmentStore } from '../../gym/application/equipment.store';
import { MaintenanceStore } from '../../maintenance/application/maintenance.store';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly api              = inject(AnalyticsApi);
  private readonly destroyRef       = inject(DestroyRef);
  private readonly equipmentStore   = inject(EquipmentStore);
  private readonly maintenanceStore = inject(MaintenanceStore);

  private readonly usageStatsSignal  = signal<AnalyticsStat[]>([]);
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

  // ── Uso de Máquinas (bar chart from real activity-report data) ────────────
  readonly machineUsageBars = computed(() => {
    const stats = this.usageStats();
    if (!stats.length) return [];

    const maxHours = Math.max(...stats.map(s => s.totalUsageHours), 1);
    return stats.map(s => ({
      name:  s.equipmentName,
      hours: s.totalUsageHours,
      pct:   (s.totalUsageHours / maxHours) * 100,
    }));
  });

  readonly maxBarHours = computed(() =>
    Math.max(...this.machineUsageBars().map(b => b.hours), 600)
  );

  // ── Equipos Subutilizados ─────────────────────────────────────────────────
  readonly underutilizedEquipment = computed(() => {
    const stats = this.usageStats();

    return stats
      .filter(s => s.totalUsageHours < 130)
      .map(s => {
        const roi: 'Bajo' | 'Medio' | 'Alto' =
          s.totalUsageHours < 80  ? 'Bajo'  :
          s.totalUsageHours < 110 ? 'Medio' : 'Alto';
        return {
          machineId: s.equipmentId.slice(0, 8),
          name:      s.equipmentName,
          location:  `Zona ${s.zoneId}`,
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
    this.api.getAnalyticsData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ stats }) => {
          this.usageStatsSignal.set(stats);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(err instanceof Error ? err.message : 'Error');
          this.loadingSignal.set(false);
        },
      });
  }
}
