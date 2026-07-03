import { Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { AdminGymStore } from '../../../application/admin-gym.store';
import { BranchStore } from '../../../application/branch.store';

@Component({
  selector: 'app-gym-branches',
  standalone: true,
  imports: [FormsModule, TranslateModule, MatIconModule, RouterLink],
  templateUrl: './gym-branches.html',
  styleUrl:    './gym-branches.scss',
})
export class GymBranchesComponent {
  readonly adminGymStore = inject(AdminGymStore);
  readonly branchStore   = inject(BranchStore);

  nameInput    = '';
  addressInput = '';

  readonly gymId = computed(() => this.adminGymStore.primaryGym()?.gymId ?? null);

  constructor() {
    this.adminGymStore.load();

    effect(() => {
      const id = this.gymId();
      if (id) this.branchStore.load(id);
    });
  }

  addBranch(): void {
    const id      = this.gymId();
    const name    = this.nameInput.trim();
    const address = this.addressInput.trim();
    if (!id || !name || !address) return;

    this.branchStore.create(id, name, address);
    this.nameInput    = '';
    this.addressInput = '';
  }

  onInputChange(): void {
    this.branchStore.clearCreateError();
  }
}
