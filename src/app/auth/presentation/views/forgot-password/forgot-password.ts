import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordStore } from '../../../application/password.store';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, TranslateModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordComponent {
  readonly store = inject(PasswordStore);

  email       = '';
  dni         = '';
  newPassword = '';
  confirmPassword = '';
  pwdMatchError   = signal(false);
  step1Submitted = false;
  step2Submitted = false;

  private static readonly EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly DNI_RE = /^[0-9]{8}$/;
  private static readonly MIN_PASSWORD = 8;

  get emailInvalid(): boolean {
    const value = this.email.trim();
    return !value || !ForgotPasswordComponent.EMAIL_RE.test(value);
  }

  private get step2Email(): string {
    return (this.email.trim() || this.store.fpEmail() || '').trim();
  }

  get step2EmailInvalid(): boolean {
    const value = this.step2Email;
    return !value || !ForgotPasswordComponent.EMAIL_RE.test(value);
  }

  get dniInvalid(): boolean {
    return !ForgotPasswordComponent.DNI_RE.test(this.dni.trim());
  }

  get newPasswordInvalid(): boolean {
    return this.newPassword.length < ForgotPasswordComponent.MIN_PASSWORD;
  }

  constructor() {
    this.store.resetForgotPassword();
  }

  submitStep1(): void {
    this.step1Submitted = true;
    if (this.emailInvalid) return;
    this.store.sendForgotPassword(this.email.trim());
  }

  submitStep2(): void {
    this.step2Submitted = true;
    if (this.step2EmailInvalid || this.dniInvalid || this.newPasswordInvalid) return;
    if (this.newPassword !== this.confirmPassword) {
      this.pwdMatchError.set(true);
      return;
    }
    this.pwdMatchError.set(false);
    this.store.verifyForgotPassword(this.step2Email, this.dni.trim(), this.newPassword);
  }
}
