import { Component } from '@angular/core';
import {
  EquipmentManagementComponent
} from '../../../../equipment/presentation/views/equipment-management/equipment-management.component';

@Component({
  selector: 'app-layout',
  imports: [EquipmentManagementComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
