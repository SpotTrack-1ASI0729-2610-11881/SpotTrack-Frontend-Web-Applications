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
import { EquipmentRow } from '../equipment-management/equipment-management';

export const CURRENCIES = ['USD', 'EUR', 'PEN', 'MXN', 'COP', 'GBP', 'BRL'] as const;

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
  templateUrl: './add-equipment-dialog.html',
  styleUrl: './add-equipment-dialog.scss',
})
export class AddEquipmentDialogComponent {
  private fb     = inject(FormBuilder);
  private router = inject(Router);
  private route  = inject(ActivatedRoute);
  private store  = inject(EquipmentStore);

  readonly equipmentStatuses = Object.values(EquipmentStatus);
  readonly currencies        = CURRENCIES;

  private existing: EquipmentRow | undefined = (history.state as { equipment?: EquipmentRow }).equipment;
  readonly isEditMode = !!this.route.snapshot.paramMap.get('id');

  form = this.fb.nonNullable.group({
    name:             [{ value: this.existing?.name  ?? '', disabled: this.isEditMode },  Validators.required],
    brand:            [{ value: this.existing?.brand ?? '', disabled: this.isEditMode },  Validators.required],
    model:            [{ value: this.existing?.model ?? '', disabled: this.isEditMode },  Validators.required],
    zoneId:           [{ value: this.existing?.zoneId ?? '', disabled: this.isEditMode }, Validators.required],
    purchaseAmount:   [{ value: this.existing?.purchaseAmount ?? (null as unknown as number), disabled: this.isEditMode }, [Validators.required, Validators.min(0)]],
    purchaseCurrency: [{ value: this.existing?.purchaseCurrency ?? 'USD', disabled: this.isEditMode }, Validators.required],
    status:           [this.existing?.status ?? EquipmentStatus.AVAILABLE, Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;
    const val = this.form.getRawValue();

    if (this.isEditMode && this.existing?.uuid) {
      this.store.updateEquipmentStatus(this.existing.uuid, val.status);
    } else {
      const entity = new Equipment({
        uuid:             '',
        name:             val.name,
        brand:            val.brand,
        model:            val.model,
        zoneId:           val.zoneId,
        purchaseAmount:   val.purchaseAmount,
        purchaseCurrency: val.purchaseCurrency,
        status:           val.status,
      });
      this.store.addEquipment(entity);
    }

    this.router.navigate(['/equipments']);
  }

  cancel(): void {
    this.router.navigate(['/equipments']);
  }
}
