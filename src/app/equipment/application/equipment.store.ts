import { computed, Injectable, Signal, signal } from '@angular/core';
import { retry } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Equipment, EquipmentStatus } from '../domain/model/equipment.entity';
import { EquipmentApi} from '../infrastructure/equipment-api';

@Injectable({ providedIn: 'root' })
export class EquipmentStore {

  private readonly equipmentSignal = signal<Equipment[]>([]);
  readonly equipment = this.equipmentSignal.asReadonly();

  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly equipmentCount  = computed(() => this.equipment().length);
  readonly operationalCount = computed(() => this.equipment().filter(e => e.status === EquipmentStatus.OPERATIONAL).length);
  readonly maintenanceCount = computed(() => this.equipment().filter(e => e.status === EquipmentStatus.MAINTENANCE).length);
  readonly outOfOrderCount  = computed(() => this.equipment().filter(e => e.status === EquipmentStatus.OUT_OF_ORDER).length);

  constructor(private api: EquipmentApi) {
    this.loadEquipment();
  }

  getEquipmentById(id: number): Signal<Equipment | undefined> {
    return computed(() => this.equipment().find(e => e.id === id));
  }

  addEquipment(entity: Equipment): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.registerEquipment(entity).pipe(retry(2)).subscribe({
      next: created => {
        this.equipmentSignal.update(list => [...list, created]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to add equipment'));
        this.loadingSignal.set(false);
      },
    });
  }

  updateEquipment(entity: Equipment): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.updateEquipment(entity).pipe(retry(2)).subscribe({
      next: updated => {
        this.equipmentSignal.update(list => list.map(e => e.id === updated.id ? updated : e));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update equipment'));
        this.loadingSignal.set(false);
      },
    });
  }

  deleteEquipment(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.deleteEquipment(id).pipe(retry(2)).subscribe({
      next: () => {
        this.equipmentSignal.update(list => list.filter(e => e.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete equipment'));
        this.loadingSignal.set(false);
      },
    });
  }

  private loadEquipment(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api.getEquipment().pipe(takeUntilDestroyed()).subscribe({
      next: list => {
        this.equipmentSignal.set(list);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load equipment'));
        this.loadingSignal.set(false);
      },
    });
  }



  private formatError(error: unknown, fallback: string): string {
    if (error instanceof Error) return error.message || fallback;
    return fallback;
  }
}
