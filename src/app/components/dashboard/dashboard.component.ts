import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html', /* Points to File 1 */
  styleUrls: ['./dashboard.component.css'],  /* Points to File 2 */
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      state('out', style({ transform: 'translateX(-100%)' })),
      transition('in <=> out', animate('300ms ease-in-out'))
    ]),
    trigger('fadeScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ]),
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class DashboardComponent {
  isSidebarOpen = false;
  isModalOpen = false;

  cards = [
    { title: 'Local Node 1', status: 'Active' },
    { title: 'Remote Node 2', status: 'Syncing' },
    { title: 'Storage Unit', status: 'Idle' }
  ];

  toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; console.log('Variable is now:', this.isSidebarOpen); }

  toggleModal() { this.isModalOpen = !this.isModalOpen; }

  resetCards() {
    const temp = [...this.cards];
    this.cards = [];
    setTimeout(() => this.cards = temp, 50);
  }

  // The manager computes the animation string
  public get sidebarState(): string {
    return this.isSidebarOpen ? 'in' : 'out';
  }
}
