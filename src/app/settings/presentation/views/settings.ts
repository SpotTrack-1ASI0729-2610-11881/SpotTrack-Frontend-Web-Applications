import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { TechnicianStore } from '../../application/technician.store';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, TranslateModule, MatIconModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class SettingsComponent {
  readonly technicianStore = inject(TechnicianStore);

  nameInput = '';
  readonly nameError = signal<string | null>(null);

  addTechnician(): void {
    const name = this.nameInput.trim();
    this.nameError.set(null);

    if (!name) {
      this.nameError.set('settings.technicians.error.nameRequired');
      return;
    }

    this.nameInput = '';
    this.technicianStore.createTechnician(name);
  }

  onNameInputChange(): void {
    this.nameError.set(null);
  }
}
