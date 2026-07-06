import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor() {
    const translate = inject(TranslateService);
    // Fallback language is configured via provideTranslateService (fallbackLang);
    // here we only set the active language. setDefaultLang is deprecated in v17.
    translate.use('en');
  }
}
