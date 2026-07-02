import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MaintenanceStore } from '../../application/maintenance.store';
import { EquipmentStore } from '../../../gym/application/equipment.store';
import { MaintenanceTicket, TicketPriority, TicketStatus } from '../../domain/model/maintenance-ticket.entity';
import { ContextMenuDirective } from '../../../shared/presentation/directives/context-menu.directive';
import { ContextMenuItem } from '../../../shared/application/context-menu.service';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslateModule, MatIconModule, MatFormFieldModule, MatSelectModule, ContextMenuDirective],
  templateUrl: './maintenance.html',
  styleUrl:    './maintenance.scss',
})
export class MaintenanceComponent {
  readonly store          = inject(MaintenanceStore);
  readonly equipmentStore = inject(EquipmentStore);

  // ── Filters ─────────────────────────────────────────────────────────────
  readonly searchQuery    = signal('');
  readonly statusFilter   = signal<TicketStatus | ''>('');
  readonly priorityFilter = signal<TicketPriority | ''>('');

  private filteredTickets = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const s = this.statusFilter();
    const p = this.priorityFilter();
    return this.store.tickets().filter(t => {
      const name = this.equipmentName(t.equipmentId).toLowerCase();
      const matchQ = !q || name.includes(q) || t.description.toLowerCase().includes(q) || this.ticketId(t).toLowerCase().includes(q);
      const matchS = !s || t.status === s;
      const matchP = !p || t.priority === p;
      return matchQ && matchS && matchP;
    });
  });

  readonly pendingFiltered    = computed(() => this.filteredTickets().filter(t => t.status === TicketStatus.OPEN));
  readonly inProgressFiltered = computed(() => this.filteredTickets().filter(t => t.status === TicketStatus.IN_PROGRESS));
  readonly resolvedFiltered   = computed(() => this.filteredTickets().filter(t => t.status === TicketStatus.RESOLVED));

  ticketId(t: MaintenanceTicket): string {
    return `T-${t.id.slice(0, 8)}`;
  }

  ticketAge(t: MaintenanceTicket): string {
    const diff = Date.now() - new Date(t.createdAt).getTime();
    const h    = Math.floor(diff / 3600000);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
  }

  equipmentName(id: string): string {
    return this.equipmentStore.equipment().find(e => e.uuid === id)?.name ?? id;
  }

  startTicket(id: string): void    { this.store.startTicket(id); }
  completeTicket(id: string): void { this.store.completeTicket(id); }

  pendingMenu(t: MaintenanceTicket): ContextMenuItem[] {
    return [
      { label: 'Start ticket',  icon: 'play_arrow',   action: () => this.startTicket(t.id) },
      { label: '', icon: '', separator: true, action: () => {} },
      { label: 'Copy ticket ID', icon: 'content_copy', action: () => navigator.clipboard.writeText(this.ticketId(t)) },
    ];
  }

  inProgressMenu(t: MaintenanceTicket): ContextMenuItem[] {
    return [
      { label: 'Mark complete', icon: 'check_circle', action: () => this.completeTicket(t.id) },
      { label: '', icon: '', separator: true, action: () => {} },
      { label: 'Copy ticket ID', icon: 'content_copy', action: () => navigator.clipboard.writeText(this.ticketId(t)) },
    ];
  }

  resolvedMenu(t: MaintenanceTicket): ContextMenuItem[] {
    return [
      { label: 'Copy ticket ID', icon: 'content_copy', action: () => navigator.clipboard.writeText(this.ticketId(t)) },
    ];
  }
}
