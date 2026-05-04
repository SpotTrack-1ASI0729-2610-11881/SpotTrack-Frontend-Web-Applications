import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EquipmentType, EquipmentStatus } from '../../../domain/model/equipment.entity';

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
    MatDialogModule,
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
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddEquipmentDialogComponent>);
  data: EquipmentFormData | null = inject(MAT_DIALOG_DATA);

  readonly equipmentTypes = Object.values(EquipmentType);
  readonly equipmentStatuses = Object.values(EquipmentStatus);
  readonly isEditMode = !!this.data?.id;

  form = this.fb.nonNullable.group({
    name:            [this.data?.name ?? '',            Validators.required],
    type:            [this.data?.type ?? EquipmentType.CARDIO, Validators.required],
    locationId:      [this.data?.locationId ?? '',      Validators.required],
    sensorId:        [this.data?.sensorId ?? '',        Validators.required],
    status:          [this.data?.status ?? EquipmentStatus.ACTIVE, Validators.required],
    usageHours:      [this.data?.usageHours ?? 0,       [Validators.required, Validators.min(0)]],
    utilizationRate: [this.data?.utilizationRate ?? 0,  [Validators.required, Validators.min(0), Validators.max(100)]],
    branchId:        [this.data?.branchId ?? '',        Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.dialogRef.close({ ...this.form.getRawValue(), id: this.data?.id });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
