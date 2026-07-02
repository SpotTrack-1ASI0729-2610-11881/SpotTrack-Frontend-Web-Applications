import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';
import { MaintenanceApi } from '../infrastructure/maintenance-api';
import { MaintenanceTicket, TicketStatus, TicketPriority, TicketType } from '../domain/model/maintenance-ticket.entity';
import { MaintenanceSchedule, TaskType, ScheduleStatus } from '../domain/model/maintenance-schedule.entity';

const PEAK_RANGES: [number, number][] = [[6, 9], [18, 21]];
export const OFF_PEAK_SUGGESTIONS     = ['10:00', '11:00', '14:00', '15:00'];

@Injectable({ providedIn: 'root' })
export class MaintenanceStore {
  private readonly api        = inject(MaintenanceApi);
  private readonly destroyRef = inject(DestroyRef);

  private readonly ticketsSignal   = signal<MaintenanceTicket[]>([]);
  private readonly schedulesSignal = signal<MaintenanceSchedule[]>([]);
  private readonly loadingSignal   = signal(false);
  private readonly errorSignal     = signal<string | null>(null);
  private readonly lastScheduledSignal = signal<MaintenanceSchedule | null>(null);

  readonly tickets       = this.ticketsSignal.asReadonly();
  readonly schedules     = this.schedulesSignal.asReadonly();
  readonly loading       = this.loadingSignal.asReadonly();
  readonly error         = this.errorSignal.asReadonly();
  readonly lastScheduled = this.lastScheduledSignal.asReadonly();

  readonly pendingTickets    = computed(() => this.tickets().filter(t => t.status === TicketStatus.OPEN));
  readonly inProgressTickets = computed(() => this.tickets().filter(t => t.status === TicketStatus.IN_PROGRESS));
  readonly resolvedTickets   = computed(() => this.tickets().filter(t => t.status === TicketStatus.RESOLVED));
  readonly totalTickets      = computed(() => this.tickets().length);
  readonly scheduledCount    = computed(() => this.schedules().length);

  readonly suggestedTimes = OFF_PEAK_SUGGESTIONS;

  constructor() { this.loadAll(); }

  isPeakHour(time: string): boolean {
    if (!time) return false;
    const hours = parseInt(time.split(':')[0], 10);
    return PEAK_RANGES.some(([s, e]) => hours >= s && hours < e);
  }

  startTicket(ticketId: string): void {
    this.ticketsSignal.update(list =>
      list.map(t => {
        if (t.id !== ticketId) return t;
        t.status = TicketStatus.IN_PROGRESS;
        return t;
      })
    );
  }

  completeTicket(ticketId: string, completedBy = 'Admin'): void {
    this.loadingSignal.set(true);
    this.api.completeTicket(ticketId)
      .pipe(retry(2))
      .subscribe({
        next: () => {
          this.loadAll();
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to complete ticket'));
          this.loadingSignal.set(false);
        },
      });
  }

  createTicket(equipmentId: string, description: string, priority: TicketPriority, type: TicketType): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.createTicket(equipmentId, description, priority, type)
      .pipe(retry(2))
      .subscribe({
        next: created => {
          this.ticketsSignal.update(list => [created, ...list]);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(err instanceof Error ? err.message : 'Failed to create ticket');
          this.loadingSignal.set(false);
        },
      });
  }

  scheduleBlock(equipmentId: number, date: string, time: string, taskType: TaskType, notes: string): void {
    const schedule = new MaintenanceSchedule({
      id: 0, equipmentId, scheduledDate: date, scheduledTime: time,
      taskType, notes, status: ScheduleStatus.CONFIRMED,
    });
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.lastScheduledSignal.set(null);
    this.api.createSchedule(schedule)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: created => {
          this.schedulesSignal.update(l => [created, ...l]);
          this.lastScheduledSignal.set(created);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(err instanceof Error ? err.message : 'Failed');
          this.loadingSignal.set(false);
        },
      });
  }

  clearLastScheduled(): void { this.lastScheduledSignal.set(null); }

  private loadAll(): void {
    this.loadingSignal.set(true);
    this.api.getTickets().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: l => this.ticketsSignal.set(l), error: () => {} });
    this.api.getSchedules().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: l => { this.schedulesSignal.set(l); this.loadingSignal.set(false); }, error: () => this.loadingSignal.set(false) });
  }

  private formatError(error: unknown, fallback: string): string {
    if (error instanceof Error) return error.message || fallback;
    return fallback;
  }
}
