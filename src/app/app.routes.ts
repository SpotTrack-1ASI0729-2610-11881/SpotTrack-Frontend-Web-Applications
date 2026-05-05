import { Routes } from '@angular/router';
import { equipmentRoutes } from './equipment/presentation/views/equipment.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/presentation/views/dashboard.component').then(m => m.DashboardComponent),
  },
  ...equipmentRoutes,
  {
    path: 'iot',
    loadComponent: () =>
      import('./iot/presentation/views/iot-monitoring.component').then(m => m.IotMonitoringComponent),
  },
  {
    path: 'maintenance',
    loadComponent: () =>
      import('./maintenance/presentation/views/maintenance.component').then(m => m.MaintenanceComponent),
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./analytics/presentation/views/analytics.component').then(m => m.AnalyticsComponent),
  },
  {
    path: 'alerts',
    loadComponent: () =>
      import('./alerts/presentation/views/alerts.component').then(m => m.AlertsComponent),
  },
];
