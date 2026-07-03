import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { MembershipApi } from '../infrastructure/membership-api';
import { AdminMembershipResource, BranchAccessResource, MembershipPlanResource } from '../infrastructure/membership-response';

@Injectable({ providedIn: 'root' })
export class MembershipStore {
  private readonly api        = inject(MembershipApi);
  private readonly destroyRef = inject(DestroyRef);

  // ── Plan catalog ─────────────────────────────────────────────────────────────
  private readonly _plans        = signal<MembershipPlanResource[]>([]);
  private readonly _branchAccess = signal<BranchAccessResource[]>([]);
  private readonly _loading      = signal(false);
  private readonly _error        = signal<string | null>(null);
  readonly selectedPlanId        = signal<number | null>(null);

  readonly loading  = this._loading.asReadonly();
  readonly error    = this._error.asReadonly();
  readonly plans    = this._plans.asReadonly();

  readonly selectedPlan = computed(() => {
    const id = this.selectedPlanId();
    return id !== null ? (this._plans().find(p => p.id === id) ?? null) : null;
  });

  readonly activePlans = computed(() =>
    this._plans().filter(p => p.is_active)
  );

  readonly branchAccessForPlan = computed(() => {
    const id = this.selectedPlanId();
    return id !== null ? this._branchAccess().filter(a => a.plan_id === id) : [];
  });

  // ── Admin's own membership ───────────────────────────────────────────────────
  private readonly _myMembership      = signal<AdminMembershipResource | null>(null);
  private readonly _membershipLoading = signal(false);
  private readonly _lifecycleLoading  = signal(false);
  private readonly _lifecycleError    = signal<string | null>(null);

  readonly myMembership      = this._myMembership.asReadonly();
  readonly membershipLoading = this._membershipLoading.asReadonly();
  readonly lifecycleLoading  = this._lifecycleLoading.asReadonly();
  readonly lifecycleError    = this._lifecycleError.asReadonly();

  constructor() { this.load(); }

  // ── Plan catalog methods ──────────────────────────────────────────────────────
  selectPlan(id: number): void { this.selectedPlanId.set(id); }
  clearSelection(): void       { this.selectedPlanId.set(null); }

  // ── Lifecycle methods ─────────────────────────────────────────────────────────
  clearLifecycleError(): void { this._lifecycleError.set(null); }

  loadMyMembership(): void {
    this._membershipLoading.set(true);

    this.api.getMyMembership()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next:  m  => { this._myMembership.set(m); this._membershipLoading.set(false); },
        error: () => { this._membershipLoading.set(false); },
      });
  }

  cancel(): void {
    const id = this._myMembership()?.membershipId;
    if (!id) return;
    this._lifecycleLoading.set(true);
    this._lifecycleError.set(null);

    this.api.cancel(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next:  updated => { this._myMembership.set(updated); this._lifecycleLoading.set(false); },
      error: ()      => { this._lifecycleError.set('membership.lifecycle.error.cancelFailed');   this._lifecycleLoading.set(false); },
    });
  }

  payDebt(): void {
    const id = this._myMembership()?.membershipId;
    if (!id) return;
    this._lifecycleLoading.set(true);
    this._lifecycleError.set(null);

    this.api.payDebt(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next:  ({ checkoutUrl }) => { this._lifecycleLoading.set(false); window.location.href = checkoutUrl; },
      error: ()                => { this._lifecycleError.set('membership.lifecycle.error.payDebtFailed'); this._lifecycleLoading.set(false); },
    });
  }

  upgradePlan(newMembershipTier: string): void {
    const id = this._myMembership()?.membershipId;
    if (!id) return;
    this._lifecycleLoading.set(true);
    this._lifecycleError.set(null);

    this.api.upgradePlan(id, newMembershipTier).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next:  ({ checkoutUrl }) => { this._lifecycleLoading.set(false); window.location.href = checkoutUrl; },
      error: ()                => { this._lifecycleError.set('membership.lifecycle.error.upgradeFailed'); this._lifecycleLoading.set(false); },
    });
  }

  downgradePlan(newMembershipTier: string): void {
    const id = this._myMembership()?.membershipId;
    if (!id) return;
    this._lifecycleLoading.set(true);
    this._lifecycleError.set(null);

    this.api.downgradePlan(id, newMembershipTier).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next:  updated => { this._myMembership.set(updated); this._lifecycleLoading.set(false); },
      error: ()      => { this._lifecycleError.set('membership.lifecycle.error.downgradeFailed'); this._lifecycleLoading.set(false); },
    });
  }

  resubscribe(membershipTier: string): void {
    this._lifecycleLoading.set(true);
    this._lifecycleError.set(null);

    this.api.resubscribe(membershipTier).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next:  ({ checkoutUrl }) => { this._lifecycleLoading.set(false); window.location.href = checkoutUrl; },
      error: ()                => { this._lifecycleError.set('membership.lifecycle.error.resubscribeFailed'); this._lifecycleLoading.set(false); },
    });
  }

  private load(): void {
    this._loading.set(true);
    this._error.set(null);

    forkJoin({ plans: this.api.getPlans(), access: this.api.getBranchAccess() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next:  ({ plans, access }) => { this._plans.set(plans); this._branchAccess.set(access); this._loading.set(false); },
        error: (err: unknown)      => { this._error.set(err instanceof Error ? err.message : 'Error al cargar membresías'); this._loading.set(false); },
      });
  }
}
