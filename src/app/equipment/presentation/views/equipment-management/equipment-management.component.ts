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
import { EquipmentStatus } from '../../../domain/model/equipment.entity';

export interface EquipmentRow {
  id:            number;
  zoneId:        number;
  name:          string;
  brand:         string;
  model:         string;
  purchasePrice: number;
  status:        EquipmentStatus;
}

const MOCK_EQUIPMENT: EquipmentRow[] = [
  { id: 1, zoneId: 1, name: 'Treadmill',             brand: 'Life Fitness',    model: 'T5 Track',   purchasePrice: 3500, status: EquipmentStatus.OPERATIONAL },
  { id: 2, zoneId: 1, name: 'Stationary Bike',       brand: 'Technogym',       model: 'Bike Excite', purchasePrice: 2800, status: EquipmentStatus.MAINTENANCE  },
  { id: 3, zoneId: 2, name: 'Chest Press Machine',   brand: 'Hammer Strength', model: 'ISO Bench',  purchasePrice: 4200, status: EquipmentStatus.OPERATIONAL },
  { id: 4, zoneId: 2, name: 'Lat Pulldown Machine',  brand: 'Matrix',          model: 'G3',         purchasePrice: 3100, status: EquipmentStatus.OUT_OF_ORDER },
];

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
  ],
  templateUrl: './equipment-management.component.html',
  styleUrl: './equipment-management.component.scss',
})
export class EquipmentManagementComponent {
  private router = inject(Router);

  readonly EquipmentStatus   = EquipmentStatus;
  readonly equipmentStatuses = Object.values(EquipmentStatus);
  readonly displayedColumns  = ['id', 'name', 'brand', 'model', 'zoneId', 'purchasePrice', 'status', 'actions'];

  private allEquipment  = signal<EquipmentRow[]>(MOCK_EQUIPMENT);
  searchQuery           = signal('');
  selectedStatus        = signal<EquipmentStatus | ''>('');

  filteredEquipment = computed(() => {
    const query  = this.searchQuery().toLowerCase();
    const status = this.selectedStatus();
    return this.allEquipment().filter(eq =>
      (!query  || eq.name.toLowerCase().includes(query) || eq.brand.toLowerCase().includes(query) || eq.model.toLowerCase().includes(query)) &&
      (!status || eq.status === status)
    );
  });

  totalEquipment    = computed(() => this.allEquipment().length);
  operationalCount  = computed(() => this.allEquipment().filter(e => e.status === EquipmentStatus.OPERATIONAL).length);
  maintenanceCount  = computed(() => this.allEquipment().filter(e => e.status === EquipmentStatus.MAINTENANCE).length);
  outOfOrderCount   = computed(() => this.allEquipment().filter(e => e.status === EquipmentStatus.OUT_OF_ORDER).length);

  navigateToNew(): void {
    this.router.navigate(['equipment', 'new']);
  }

  navigateToEdit(row: EquipmentRow): void {
    this.router.navigate(['equipment', row.id, 'edit'], { state: { equipment: row } });
  }

  deleteEquipment(id: number): void {
    this.allEquipment.update(list => list.filter(eq => eq.id !== id));
  }

  onSearchChange(value: string): void          { this.searchQuery.set(value); }
  onStatusChange(value: EquipmentStatus | ''): void { this.selectedStatus.set(value); }
}
