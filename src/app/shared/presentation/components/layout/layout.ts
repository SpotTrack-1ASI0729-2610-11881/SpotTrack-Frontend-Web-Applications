import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, LanguageSwitcher, Sidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
