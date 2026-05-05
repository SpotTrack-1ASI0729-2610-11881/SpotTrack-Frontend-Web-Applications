import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EquipmentStatus } from '../../../domain/model/equipment.entity';
import { EquipmentStore } from '../../../application/equipment.store';



export interface EquipmentRow {
  id:            number;
  zoneId:        number;
  name:          string;
  brand:         string;
  model:         string;
  purchasePrice: number;
  status:        EquipmentStatus;
}

@Component({
  selector: 'app-equipment-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './equipment-management.component.html',
  styleUrl: './equipment-management.component.scss',
})
export class EquipmentManagementComponent {
  private router = inject(Router);
  private store  = inject(EquipmentStore);


  readonly EquipmentStatus   = EquipmentStatus;
  readonly equipmentStatuses = Object.values(EquipmentStatus);
  readonly displayedColumns  = ['id', 'name', 'brand', 'model', 'zoneId', 'purchasePrice', 'status', 'actions'];

  searchQuery    = signal('');
  selectedStatus = signal<EquipmentStatus | ''>('');

  readonly isLoading       = this.store.loading;
  readonly totalEquipment   = this.store.equipmentCount;
  readonly operationalCount = this.store.operationalCount;
  readonly maintenanceCount = this.store.maintenanceCount;
  readonly outOfOrderCount  = this.store.outOfOrderCount;

    filteredEquipment = computed(() => {
    const query  = this.searchQuery().toLowerCase();
    const status = this.selectedStatus();
    return this.store.equipment()
      .filter(e =>
        (!query  || e.name.toLowerCase().includes(query) ||
                    e.brand.toLowerCase().includes(query) ||
                    e.model.toLowerCase().includes(query)) &&
        (!status || e.status === status)
      )
      .map(e => ({
        id:            e.id,
        zoneId:        e.zoneId,
        name:          e.name,
        brand:         e.brand,
        model:         e.model,
        purchasePrice: e.purchasePrice,
        status:        e.status,
      } as EquipmentRow));
  });

  navigateToNew(): void {
    this.router.navigate(['equipment', 'new']);
  }

  navigateToEdit(row: EquipmentRow): void {
    this.router.navigate(['equipment', row.id, 'edit'], { state: { equipment: row } });
  }

  deleteEquipment(id: number): void {
    this.store.deleteEquipment(id);
  }

  onSearchChange(value: string): void               { this.searchQuery.set(value); }
  onStatusChange(value: EquipmentStatus | ''): void { this.selectedStatus.set(value); }
}
