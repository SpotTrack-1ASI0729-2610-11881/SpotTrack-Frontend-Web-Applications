import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, TranslateModule],
  template: `
    <div class="stub-page">
      <mat-icon>home</mat-icon>
      <h1>{{ 'nav.dashboard' | translate }}</h1>
      <p>Coming soon</p>
    </div>
  `,
  styles: [`
    .stub-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 16px;
      color: #aaa;
    }
    mat-icon { font-size: 64px; width: 64px; height: 64px; color: #4fc3f7; }
    h1 { margin: 0; color: #fff; font-size: 1.5rem; }
    p { margin: 0; }
  `]
})
export class DashboardComponent {}
