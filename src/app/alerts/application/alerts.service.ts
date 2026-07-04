import { Injectable, signal, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertsApi } from '../infrastructure/alerts-api';
import { AlertResource } from '../infrastructure/alerts-response';

export interface AppAlert {
  id: string;
  backendId?: number;       // present only for alerts sourced from the backend
  title?: string;           // plain text (for dynamically generated alerts)
  titleKey?: string;        // i18n key (for seeded/static alerts)
  description?: string;
  descriptionKey?: string;
  type: 'admin' | 'client' | 'system';
  icon: string;
  date: Date;
  targetRoute: string;
  read: boolean;
}

@Injectable({ providedIn: 'root' })
export class AlertsService {
  private translate = inject(TranslateService);
  private api        = inject(AlertsApi);

  alerts = signal<AppAlert[]>([
    {
      id: 'ALR-003',
      titleKey:       'alerts.seeded.alr003.title',
      descriptionKey: 'alerts.seeded.alr003.description',
      type:        'client',
      icon:        'person',
      date:        new Date(Date.now() - 1440 * 60000),
      targetRoute: '/dashboard',
      read:        true,
    },
  ]);

  constructor() {
    this.loadBackendAlerts();
  }

  private loadBackendAlerts(): void {
    this.api.getAlerts().subscribe({
      next: resources => {
        const mapped = resources.map(r => this.toAppAlert(r));
        this.alerts.update(list => [...mapped, ...list]);
      },
      error: () => { /* alert bell stays local-only if the backend call fails */ },
    });
  }

  private toAppAlert(r: AlertResource): AppAlert {
    const isWarning = r.severity === 'WARNING';
    return {
      id:          `BE-${r.id}`,
      backendId:   r.id,
      titleKey:    isWarning ? 'alerts.backend.maintenanceThreshold.title' : 'alerts.backend.anomalyReported.title',
      description: r.message,
      type:        'admin',
      icon:        isWarning ? 'build' : 'report_problem',
      date:        new Date(r.createdAt),
      targetRoute: '/maintenance',
      read:        r.isResolved,
    };
  }

  // Called when a pending reservation is not activated within 5 minutes
  addReservationAutoCancelledAlert(nameKey: string): void {
    const machine = this.translate.instant('machines.names.' + nameKey);
    this.alerts.update(list => [
      {
        id:          `RES-CANCEL-${Date.now()}`,
        title:       this.translate.instant('clientAlerts.reservationAutoCancelled.title',       { machine }),
        description: this.translate.instant('clientAlerts.reservationAutoCancelled.description', { machine }),
        type:        'client',
        icon:        'event_busy',
        date:        new Date(),
        targetRoute: '/bookings',
        read:        false,
      },
      ...list,
    ]);
  }

  // Called when a reservation timer expires
  addReservationExpiredAlert(nameKey: string): void {
    const machine = this.translate.instant('machines.names.' + nameKey);
    this.alerts.update(list => [
      {
        id:          `RES-EXP-${Date.now()}`,
        title:       this.translate.instant('clientAlerts.reservationExpired.title',       { machine }),
        description: this.translate.instant('clientAlerts.reservationExpired.description', { machine }),
        type:        'client',
        icon:        'event_busy',
        date:        new Date(),
        targetRoute: '/bookings',
        read:        false,
      },
      ...list,
    ]);
  }

  deleteAlert(id: string): void {
    const alert = this.alerts().find(a => a.id === id);
    if (alert?.backendId) {
      this.api.resolveAlert(alert.backendId).subscribe();
    }
    this.alerts.update(list => list.filter(a => a.id !== id));
  }

  // Only marks alerts that belong to the given role as read
  markReadForRole(role: 'admin' | 'client'): void {
    this.alerts.update(list =>
      list.map(a => {
        if (role === 'client' && a.type !== 'client') return a;
        return { ...a, read: true };
      })
    );
  }
}
