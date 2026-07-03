import { inject, Injectable, signal } from '@angular/core';
import { ZoneApi } from '../infrastructure/zone-api';
import { Zone } from '../domain/model/zone.entity';

@Injectable({ providedIn: 'root' })
export class ZoneStore {
  private readonly api = inject(ZoneApi);

  private readonly zonesSignal   = signal<Zone[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly loadedSignal  = signal(false);
  private readonly errorSignal   = signal<string | null>(null);

  readonly zones   = this.zonesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly loaded  = this.loadedSignal.asReadonly();
  readonly error   = this.errorSignal.asReadonly();

  load(gymId: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api.getZones(gymId).subscribe({
      next: list => {
        this.zonesSignal.set(list);
        this.loadingSignal.set(false);
        this.loadedSignal.set(true);
      },
      error: () => {
        this.errorSignal.set('map.branches.loadZonesFailed');
        this.loadingSignal.set(false);
        this.loadedSignal.set(true);
      },
    });
  }
}
