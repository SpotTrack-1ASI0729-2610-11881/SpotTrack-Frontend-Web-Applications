import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MonitoringStore } from '../../../monitoring/application/monitoring.store';
import { SessionTrackerResource } from '../../../monitoring/infrastructure/monitoring-response';

type SensorType = 'camera' | 'motion';

interface SensorRow {
  sensorId: string;
  type: SensorType;
  equipmentId: string;
  equipmentName: string | null;
  equipmentStatus: string | null;
  registeredAt: string;
}

@Component({
  selector: 'app-iot-monitoring',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslateModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './iot-monitoring.html',
  styleUrl: './iot-monitoring.scss',
})
export class IotMonitoringComponent {
  readonly sessionStore = inject(MonitoringStore);

  constructor() {
    this.refreshAll();
  }

  readonly displayedColumns = ['sensorId', 'type', 'equipment', 'status', 'registeredAt'];

  readonly isLoading = this.sessionStore.actionLoading;

  readonly sensorRows = computed<SensorRow[]>(() => [
    ...this.sessionStore.cameraSensors().map(s => ({
      sensorId: s.cameraSensorId,
      type: 'camera' as SensorType,
      equipmentId: s.equipmentId,
      equipmentName: s.equipmentName,
      equipmentStatus: s.equipmentStatus,
      registeredAt: s.registeredAt,
    })),
    ...this.sessionStore.motionSensors().map(s => ({
      sensorId: s.motionSensorId,
      type: 'motion' as SensorType,
      equipmentId: s.equipmentId,
      equipmentName: s.equipmentName,
      equipmentStatus: s.equipmentStatus,
      registeredAt: s.registeredAt,
    })),
  ]);

  readonly cameraSensorCount = computed(() => this.sessionStore.cameraSensors().length);
  readonly motionSensorCount = computed(() => this.sessionStore.motionSensors().length);
  readonly totalSensorCount  = computed(() => this.cameraSensorCount() + this.motionSensorCount());
  readonly activeSessionCount = computed(() =>
    this.sessionStore.trackedSessions().filter(s => s.sessionIsActive).length
  );

  searchQuery = signal('');
  typeFilter  = signal<SensorType | ''>('');

  readonly filteredSensors = computed(() => {
    const q    = this.searchQuery().toLowerCase();
    const type = this.typeFilter();
    return this.sensorRows().filter(s => {
      const matchesSearch =
        !q ||
        s.sensorId.toLowerCase().includes(q) ||
        (s.equipmentName ?? '').toLowerCase().includes(q);
      const matchesType = !type || s.type === type;
      return matchesSearch && matchesType;
    });
  });

  onSearchChange(v: string): void { this.searchQuery.set(v); }
  onTypeFilterChange(v: string): void { this.typeFilter.set(v as SensorType | ''); }

  onRefresh(): void { this.refreshAll(); }

  private refreshAll(): void {
    this.sessionStore.loadCameraSensors();
    this.sessionStore.loadMotionSensors();
    this.sessionStore.loadSessionTrackers();
  }

  // ── Session monitoring (usage detection, inactivity, session time) ─────────

  readonly sessionLoading = this.sessionStore.actionLoading;
  readonly sessionError = this.sessionStore.actionError;
  readonly trackedSessions = this.sessionStore.trackedSessions;

  readonly selectedSessionId = signal<string | null>(null);
  readonly selectedSession = computed<SessionTrackerResource | undefined>(() =>
    this.trackedSessions().find(s => s.sessionTrackerId === this.selectedSessionId())
  );

  selectSession(sessionTrackerId: string): void {
    this.selectedSessionId.set(sessionTrackerId);
  }

  verifySession(): void {
    const id = this.selectedSessionId();
    if (id) this.sessionStore.verifySessionUsage(id);
  }

  endSession(): void {
    const id = this.selectedSessionId();
    if (id) this.sessionStore.endUsageSession(id);
  }

  calculateSessionTime(): void {
    const id = this.selectedSessionId();
    if (id) this.sessionStore.calculateSessionTime(id);
  }

  captureCameraMotion(detected: boolean): void {
    const equipmentId = this.selectedSession()?.equipmentId;
    if (equipmentId) this.sessionStore.captureCameraMotion(equipmentId, detected);
  }

  captureMotionReading(detected: boolean): void {
    const equipmentId = this.selectedSession()?.equipmentId;
    if (equipmentId) this.sessionStore.captureMotionSensorReading(equipmentId, detected);
  }
}
