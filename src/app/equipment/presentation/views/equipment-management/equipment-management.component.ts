import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
import { EquipmentApi } from '../../../infrastructure/equipment.api';

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
export class EquipmentManagementComponent implements OnInit {
  private router = inject(Router);
  private api    = inject(EquipmentApi);

  readonly EquipmentStatus   = EquipmentStatus;
  readonly equipmentStatuses = Object.values(EquipmentStatus);
  readonly displayedColumns  = ['id', 'name', 'brand', 'model', 'zoneId', 'purchasePrice', 'status', 'actions'];

  private allEquipment = signal<EquipmentRow[]>([]);
  isLoading            = signal(true);
  searchQuery          = signal('');
  selectedStatus       = signal<EquipmentStatus | ''>('');

  filteredEquipment = computed(() => {
    const query  = this.searchQuery().toLowerCase();
    const status = this.selectedStatus();
    return this.allEquipment().filter(eq =>
      (!query  || eq.name.toLowerCase().includes(query) ||
                  eq.brand.toLowerCase().includes(query) ||
                  eq.model.toLowerCase().includes(query)) &&
      (!status || eq.status === status)
    );
  });

  totalEquipment   = computed(() => this.allEquipment().length);
  operationalCount = computed(() => this.allEquipment().filter(e => e.status === EquipmentStatus.OPERATIONAL).length);
  maintenanceCount = computed(() => this.allEquipment().filter(e => e.status === EquipmentStatus.MAINTENANCE).length);
  outOfOrderCount  = computed(() => this.allEquipment().filter(e => e.status === EquipmentStatus.OUT_OF_ORDER).length);

  ngOnInit(): void {
    this.api.getEquipment().subscribe({
      next: (list) => {
        this.allEquipment.set(list.map(e => ({
          id:            e.id,
          zoneId:        e.zoneId,
          name:          e.name,
          brand:         e.brand,
          model:         e.model,
          purchasePrice: e.purchasePrice,
          status:        e.status,
        })));
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  navigateToNew(): void {
    this.router.navigate(['equipment', 'new']);
  }

  navigateToEdit(row: EquipmentRow): void {
    this.router.navigate(['equipment', row.id, 'edit'], { state: { equipment: row } });
  }

  deleteEquipment(id: number): void {
    this.api.deleteEquipment(id.toString()).subscribe(() => {
      this.allEquipment.update(list => list.filter(eq => eq.id !== id));
    });
  }

  onSearchChange(value: string): void              { this.searchQuery.set(value); }
  onStatusChange(value: EquipmentStatus | ''): void { this.selectedStatus.set(value); }
}
