import { computed, Injectable, Signal, signal } from '@angular/core';
import { retry } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Iot, IotStatus } from '../domain/model/iot.entity';
import { IotApi } from '../infrastructure/iot-api';

@Injectable({ providedIn: 'root' })
export class IotStore {
  private readonly devicesSignal = signal<Iot[]>([]);
  readonly devices = this.devicesSignal.asReadonly();

  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly deviceCount   = computed(() => this.devices().length);
  readonly activeCount   = computed(() => this.devices().filter(d => d.status === IotStatus.ACTIVE).length);
  readonly inactiveCount = computed(() => this.devices().filter(d => d.status === IotStatus.INACTIVE).length);

  constructor(private api: IotApi) {
    this.loadDevices();
  }

  getDeviceById(id: number): Signal<Iot | undefined> {
    return computed(() => this.devices().find(d => d.id === id));
  }

  private loadDevices(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.getDevices().pipe(takeUntilDestroyed()).subscribe({
      next: list => {
        this.devicesSignal.set(list);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load devices'));
        this.loadingSignal.set(false);
      },
    });
  }

  private formatError(error: unknown, fallback: string): string {
    if (error instanceof Error) return error.message || fallback;
    return fallback;
  }
}
