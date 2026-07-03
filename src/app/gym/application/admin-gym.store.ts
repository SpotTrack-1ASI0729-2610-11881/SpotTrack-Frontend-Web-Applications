import { computed, inject, Injectable, signal } from '@angular/core';
import { GymAdminApi } from '../infrastructure/gym-admin-api';
import { GymSummaryResource } from '../infrastructure/gym-api';

@Injectable({ providedIn: 'root' })
export class AdminGymStore {
  private readonly api = inject(GymAdminApi);

  private readonly myGymsSignal  = signal<GymSummaryResource[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal   = signal<string | null>(null);

  readonly myGyms  = this.myGymsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error   = this.errorSignal.asReadonly();

  // Convenience accessor for the common single-gym case.
  // Future screens that need multi-gym selection can consume myGyms() directly.
  readonly primaryGym = computed(() => this.myGymsSignal()[0] ?? null);

  load(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api.getMyGyms().subscribe({
      next: list => {
        this.myGymsSignal.set(list);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.errorSignal.set('gym.error.myGymsFailed');
        this.loadingSignal.set(false);
      },
    });
  }
}
