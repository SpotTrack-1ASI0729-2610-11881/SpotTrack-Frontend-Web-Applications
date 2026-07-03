import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProfileApiService, ProfileSummary } from '../infrastructure/profile-api.service';

@Injectable({ providedIn: 'root' })
export class ProfileStore {
  private readonly api        = inject(ProfileApiService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _profile = signal<ProfileSummary | null>(null);
  private readonly _loading = signal(false);
  private readonly _error   = signal<string | null>(null);

  readonly profile = this._profile.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error   = this._error.asReadonly();

  loadClientProfile(): void {
    this._loading.set(true);
    this._error.set(null);
    this.api.getMyClientProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: profile => { this._profile.set(profile); this._loading.set(false); },
        error: (err: unknown) => {
          this._error.set(err instanceof Error ? err.message : 'Error al cargar el perfil');
          this._loading.set(false);
        },
      });
  }

  loadAdminProfile(): void {
    this._loading.set(true);
    this._error.set(null);
    this.api.getMyAdminProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: profile => { this._profile.set(profile); this._loading.set(false); },
        error: (err: unknown) => {
          this._error.set(err instanceof Error ? err.message : 'Error al cargar el perfil');
          this._loading.set(false);
        },
      });
  }
}
