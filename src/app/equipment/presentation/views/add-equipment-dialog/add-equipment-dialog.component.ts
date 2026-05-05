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
import { Equipment, EquipmentStatus } from '../../../domain/model/equipment.entity';
import { EquipmentStore } from '../../../application/equipment.store';
import { EquipmentRow } from '../equipment-management/equipment-management.component';

export interface EquipmentFormData {
  id?:           number;
  name:          string;
  brand:         string;
  model:         string;
  zoneId:        number;
  purchasePrice: number;
  status:        EquipmentStatus;
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
  private store  = inject(EquipmentStore);

  readonly equipmentStatuses = Object.values(EquipmentStatus);

  private existing: EquipmentRow | undefined = (history.state as { equipment?: EquipmentRow }).equipment;
  readonly isEditMode = !!this.route.snapshot.paramMap.get('id');

  form = this.fb.nonNullable.group({
    name:          [this.existing?.name          ?? '',                          Validators.required],
    brand:         [this.existing?.brand         ?? '',                          Validators.required],
    model:         [this.existing?.model         ?? '',                          Validators.required],
    zoneId:        [this.existing?.zoneId        ?? (null as unknown as number), Validators.required],
    purchasePrice: [this.existing?.purchasePrice ?? (null as unknown as number), [Validators.required, Validators.min(0)]],
    status:        [this.existing?.status        ?? EquipmentStatus.OPERATIONAL,  Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;
    const val = this.form.getRawValue();
    const entity = new Equipment({
      id:            this.existing?.id ?? 0,
      name:          val.name,
      brand:         val.brand,
      model:         val.model,
      zoneId:        val.zoneId,
      purchasePrice: val.purchasePrice,
      status:        val.status,
    });

    if (this.isEditMode) {
      this.store.updateEquipment(entity);
    } else {
      this.store.addEquipment(entity);
    }

    this.router.navigate(['equipment']);
  }

  cancel(): void {
    this.router.navigate(['equipment']);
  }
}
