import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EquipmentType, EquipmentStatus } from '../../../domain/model/equipment.entity';
import { EquipmentRow } from '../equipment-management/equipment-management.component';

export interface EquipmentFormData {
  id?: string;
  name: string;
  type: EquipmentType;
  locationId: string;
  sensorId: string;
  status: EquipmentStatus;
  usageHours: number;
  utilizationRate: number;
  branchId: string;
}

@Component({
  selector: 'app-add-equipment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './add-equipment-dialog.component.html',
  styleUrl: './add-equipment-dialog.component.scss',
})
export class AddEquipmentDialogComponent {
  private fb     = inject(FormBuilder);
  private router = inject(Router);
  private route  = inject(ActivatedRoute);

  readonly equipmentTypes    = Object.values(EquipmentType);
  readonly equipmentStatuses = Object.values(EquipmentStatus);

  // Data passed via router state when navigating to edit
  private existing: EquipmentRow | undefined = (history.state as { equipment?: EquipmentRow }).equipment;
  readonly isEditMode = !!this.route.snapshot.paramMap.get('id');

  form = this.fb.nonNullable.group({
    name:            [this.existing?.name            ?? '',                    Validators.required],
    type:            [this.existing?.type            ?? EquipmentType.CARDIO,  Validators.required],
    locationId:      [this.existing?.locationId      ?? '',                    Validators.required],
    sensorId:        [this.existing?.sensorId        ?? '',                    Validators.required],
    status:          [this.existing?.status          ?? EquipmentStatus.ACTIVE, Validators.required],
    usageHours:      [this.existing?.usageHours      ?? 0,  [Validators.required, Validators.min(0)]],
    utilizationRate: [this.existing?.utilizationRate ?? 0,  [Validators.required, Validators.min(0), Validators.max(100)]],
    branchId:        [this.existing?.branchId        ?? '',                    Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;
    // TODO: dispatch to store/service
    this.router.navigate(['equipment']);
  }

  cancel(): void {
    this.router.navigate(['equipment']);
  }
}
