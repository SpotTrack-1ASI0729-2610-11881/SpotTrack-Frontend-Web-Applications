import { Routes } from '@angular/router';

export const equipmentRoutes: Routes = [
  {
    path: 'equipment',
    loadComponent: () =>
      import('./equipment-management/equipment-management.component').then(
        m => m.EquipmentManagementComponent
      ),
  },
  {
    path: 'equipment/new',
    loadComponent: () =>
      import('./add-equipment-dialog/add-equipment-dialog.component').then(
        m => m.AddEquipmentDialogComponent
      ),
  },
  {
    path: 'equipment/:id/edit',
    loadComponent: () =>
      import('./add-equipment-dialog/add-equipment-dialog.component').then(
        m => m.AddEquipmentDialogComponent
      ),
  },
];
