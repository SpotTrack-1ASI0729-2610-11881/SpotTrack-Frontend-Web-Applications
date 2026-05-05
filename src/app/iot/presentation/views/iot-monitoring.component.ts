import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { IotStore } from '../../application/iot.store';
import { IotStatus } from '../../domain/model/iot.entity';

@Component({
  selector: 'app-iot-monitoring',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './iot-monitoring.component.html',
  styleUrl: './iot-monitoring.component.scss',
})
export class IotMonitoringComponent {
  private store = inject(IotStore);

  readonly IotStatus       = IotStatus;
  readonly displayedColumns = ['id', 'equipmentId', 'macAddress', 'status', 'lastHeartbeat'];

  readonly isLoading     = this.store.loading;
  readonly deviceCount   = this.store.deviceCount;
  readonly activeCount   = this.store.activeCount;
  readonly inactiveCount = this.store.inactiveCount;

  searchQuery = signal('');

  readonly filteredDevices = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.store.devices().filter(d =>
      !query ||
      d.macAddress.toLowerCase().includes(query) ||
      d.equipmentId.toString().includes(query)
    );
  });

  onSearchChange(value: string): void { this.searchQuery.set(value); }
}
