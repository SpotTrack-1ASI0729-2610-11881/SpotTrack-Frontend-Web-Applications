import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

interface NavItem {
  path: string;
  icon: string;
  labelKey: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, TranslateModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly navItems: NavItem[] = [
    { path: '/equipment',   icon: 'fitness_center', labelKey: 'nav.equipment' },
    { path: '/iot',         icon: 'sensors',        labelKey: 'nav.iot' },
    { path: '/maintenance', icon: 'build',           labelKey: 'nav.maintenance' },
    { path: '/analytics',   icon: 'bar_chart',       labelKey: 'nav.analytics' },
    { path: '/alerts',      icon: 'notifications',   labelKey: 'nav.alerts' },
  ];
}
