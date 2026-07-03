import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcher } from '../../../../shared/presentation/components/language-switcher/language-switcher';
import { AuthStore } from '../../../application/auth.store';
import { PasswordStore } from '../../../application/password.store';
import { ProfileStore } from '../../../application/profile.store';
import { ActiveGymStore } from '../../../application/active-gym.store';
import { GymListStore } from '../../../../gym/application/gym-list.store';
import { ContextMenuDirective } from '../../../../shared/presentation/directives/context-menu.directive';
import { ContextMenuItem } from '../../../../shared/application/context-menu.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  imports: [LanguageSwitcher, MatIconModule, TranslateModule, ContextMenuDirective, FormsModule],
})
export class ProfileComponent implements OnInit {
  private authStore     = inject(AuthStore);
  private router        = inject(Router);
  readonly pwdStore      = inject(PasswordStore);
  readonly profileStore  = inject(ProfileStore);
  readonly activeGymStore = inject(ActiveGymStore);
  readonly gymListStore   = inject(GymListStore);

  readonly pageMenu: ContextMenuItem[] = [
    { label: 'Logout', icon: 'logout', action: () => this.logout() },
  ];

  logout() {
    this.authStore.logout();
    this.router.navigate(['/login']);
  }

  readonly currentUser = this.authStore.currentUser;
  readonly isAdmin     = this.authStore.isAdmin;

  readonly profile        = this.profileStore.profile;
  readonly profileLoading = this.profileStore.loading;

  readonly activeGymName = computed(() => {
    const gymId = this.activeGymStore.activeGym()?.gymId;
    if (!gymId) return null;
    return this.gymListStore.gyms().find(g => g.gymId === gymId)?.name ?? null;
  });

  ngOnInit(): void {
    if (this.isAdmin()) {
      this.profileStore.loadAdminProfile();
    } else {
      this.profileStore.loadClientProfile();
      this.gymListStore.load();
      // AuthStore only loads gym associations right after login() — if this page
      // is reached via a restored session (page refresh, direct navigation) that
      // never ran, so reload here to make the profile page self-sufficient.
      this.activeGymStore.loadAssociations();
    }
  }

  readonly showChangePwd = signal(false);

  currentPassword = '';
  newPassword     = '';
  confirmPassword = '';
  pwdMatchError   = false;

  toggleChangePwd(): void {
    this.showChangePwd.update(v => !v);
    this.pwdStore.resetChangePwd();
    this.currentPassword = '';
    this.newPassword     = '';
    this.confirmPassword = '';
    this.pwdMatchError   = false;
  }

  submitChangePassword(): void {
    this.pwdMatchError = this.newPassword !== this.confirmPassword;
    if (this.pwdMatchError) return;
    this.pwdStore.changePassword(this.currentPassword, this.newPassword);
  }

  readonly gymData = {
    name: 'SpotTrack Gym',
    locations: 3,
    equipmentTotal: 47,
    iotSensorsOnline: 43,
    memberCount: 312,
    plan: 'Enterprise',
    planPrice: '$299/mes',
    planFeatures: [
      'Hasta 5 sedes activas',
      'Equipos ilimitados monitoreados',
      'Sensores IoT en tiempo real',
      'Analíticas avanzadas e impacto financiero',
      'Soporte prioritario 24/7',
    ],
    renewalDate: '24 de Mayo, 2026',
    memberSince: 'Enero 2024',
  };
}
