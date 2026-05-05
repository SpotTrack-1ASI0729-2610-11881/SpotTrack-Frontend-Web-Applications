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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EquipmentType, EquipmentStatus } from '../../../domain/model/equipment.entity';

export interface EquipmentRow {
  id: string;
  name: string;
  type: EquipmentType;
  locationId: string;
  sensorId: string;
  status: EquipmentStatus;
  usageHours: number;
  utilizationRate: number;
  branchId: string;
}

const MOCK_EQUIPMENT: EquipmentRow[] = [
  { id: 'EQ-001', name: 'Cinta 3',         type: EquipmentType.CARDIO,     locationId: 'Zona Cardio',    sensorId: 'SNS-101', status: EquipmentStatus.ACTIVE,      usageHours: 500, utilizationRate: 82, branchId: 'BR-01' },
  { id: 'EQ-002', name: 'Prensa Piernas',  type: EquipmentType.STRENGTH,   locationId: 'Zona Fuerza',    sensorId: 'SNS-102', status: EquipmentStatus.MAINTENANCE, usageHours: 480, utilizationRate: 45, branchId: 'BR-01' },
  { id: 'EQ-003', name: 'Elíptica 2',      type: EquipmentType.CARDIO,     locationId: 'Zona Cardio',    sensorId: 'SNS-103', status: EquipmentStatus.ACTIVE,      usageHours: 320, utilizationRate: 71, branchId: 'BR-02' },
  { id: 'EQ-004', name: 'Rack Sentadilla', type: EquipmentType.STRENGTH,   locationId: 'Zona Fuerza',    sensorId: 'SNS-104', status: EquipmentStatus.ACTIVE,      usageHours: 610, utilizationRate: 90, branchId: 'BR-01' },
  { id: 'EQ-005', name: 'Banco Pecho',     type: EquipmentType.FUNCTIONAL, locationId: 'Zona Funcional', sensorId: 'SNS-105', status: EquipmentStatus.INACTIVE,    usageHours: 55,  utilizationRate: 18, branchId: 'BR-02' },
  { id: 'EQ-006', name: 'Polea Alta',      type: EquipmentType.STRENGTH,   locationId: 'Zona Fuerza',    sensorId: 'SNS-106', status: EquipmentStatus.ACTIVE,      usageHours: 395, utilizationRate: 66, branchId: 'BR-03' },
  { id: 'EQ-007', name: 'Bicicleta 1',    type: EquipmentType.CARDIO,     locationId: 'Zona Cardio',    sensorId: 'SNS-107', status: EquipmentStatus.MAINTENANCE, usageHours: 200, utilizationRate: 30, branchId: 'BR-03' },
  { id: 'EQ-008', name: 'Cuerda Batida',   type: EquipmentType.FUNCTIONAL, locationId: 'Zona Funcional', sensorId: 'SNS-108', status: EquipmentStatus.ACTIVE,      usageHours: 140, utilizationRate: 55, branchId: 'BR-01' },
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
    MatProgressBarModule,
  ],
  templateUrl: './equipment-management.component.html',
  styleUrl: './equipment-management.component.scss',
})
export class EquipmentManagementComponent {
  private router = inject(Router);

  readonly EquipmentType = EquipmentType;
  readonly EquipmentStatus = EquipmentStatus;
  readonly equipmentTypes = Object.values(EquipmentType);
  readonly equipmentStatuses = Object.values(EquipmentStatus);
  readonly displayedColumns = ['id', 'name', 'type', 'locationId', 'status', 'usageHours', 'utilizationRate', 'branchId', 'actions'];

  private allEquipment = signal<EquipmentRow[]>(MOCK_EQUIPMENT);
  searchQuery   = signal('');
  selectedType  = signal<EquipmentType | ''>('');
  selectedStatus = signal<EquipmentStatus | ''>('');

  filteredEquipment = computed(() => {
    const query  = this.searchQuery().toLowerCase();
    const type   = this.selectedType();
    const status = this.selectedStatus();
    return this.allEquipment().filter(eq =>
      (!query  || eq.id.toLowerCase().includes(query) || eq.name.toLowerCase().includes(query)) &&
      (!type   || eq.type === type) &&
      (!status || eq.status === status)
    );
  });

  totalEquipment   = computed(() => this.allEquipment().length);
  activeCount      = computed(() => this.allEquipment().filter(e => e.status === EquipmentStatus.ACTIVE).length);
  maintenanceCount = computed(() => this.allEquipment().filter(e => e.status === EquipmentStatus.MAINTENANCE).length);
  inactiveCount    = computed(() => this.allEquipment().filter(e => e.status === EquipmentStatus.INACTIVE).length);

  navigateToNew(): void {
    this.router.navigate(['equipment', 'new']);
  }

  navigateToEdit(row: EquipmentRow): void {
    this.router.navigate(['equipment', row.id, 'edit'], { state: { equipment: row } });
  }

  deleteEquipment(id: string): void {
    this.allEquipment.update(list => list.filter(eq => eq.id !== id));
  }

  onSearchChange(value: string): void  { this.searchQuery.set(value); }
  onTypeChange(value: EquipmentType | ''): void   { this.selectedType.set(value); }
  onStatusChange(value: EquipmentStatus | ''): void { this.selectedStatus.set(value); }

  getUtilizationClass(rate: number): string {
    if (rate >= 70) return 'util--high';
    if (rate >= 40) return 'util--medium';
    return 'util--low';
  }
}
