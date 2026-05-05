import { Routes } from '@angular/router';
import { equipmentRoutes } from './equipment/presentation/views/equipment.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'equipment', pathMatch: 'full' },
  ...equipmentRoutes,
];
