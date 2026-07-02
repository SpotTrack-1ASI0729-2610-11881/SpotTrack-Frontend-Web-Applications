import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { MaintenanceTicket } from '../domain/model/maintenance-ticket.entity';
import { MaintenanceSchedule } from '../domain/model/maintenance-schedule.entity';
import { MaintenanceTicketApiEndpoint } from './maintenance-ticket-api-endpoint';
import { MaintenanceScheduleApiEndpoint } from './maintenance-schedule-api-endpoint';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MaintenanceApi extends BaseApi {
  private readonly ticketEndpoint: MaintenanceTicketApiEndpoint;
  private readonly scheduleEndpoint: MaintenanceScheduleApiEndpoint;

  constructor(private readonly http: HttpClient) {
    super();
    this.ticketEndpoint = new MaintenanceTicketApiEndpoint(http);
    this.scheduleEndpoint = new MaintenanceScheduleApiEndpoint(http);
  }

  getTickets(): Observable<MaintenanceTicket[]> {
    return this.ticketEndpoint.getAll();
  }

  createTicket(
    equipmentId: string,
    description: string,
    priority: string,
    type: string,
  ): Observable<MaintenanceTicket> {
    return this.ticketEndpoint.createTicket(equipmentId, description, priority, type);
  }

  getSchedules(): Observable<MaintenanceSchedule[]> {
    return this.scheduleEndpoint.getAll();
  }
  getScheduleById(id: number): Observable<MaintenanceSchedule> {
    return this.scheduleEndpoint.getById(id);
  }
  createSchedule(schedule: MaintenanceSchedule): Observable<MaintenanceSchedule> {
    return this.scheduleEndpoint.create(schedule);
  }
  updateSchedule(schedule: MaintenanceSchedule): Observable<MaintenanceSchedule> {
    return this.scheduleEndpoint.update(schedule, schedule.id);
  }
  deleteSchedule(id: number): Observable<void> {
    return this.scheduleEndpoint.delete(id);
  }

  createMaintenanceRequest(equipmentId: string, description: string): Observable<any> {
    return this.http.post(`${environment.apiBase}/maintenance/requests`, {
      equipmentId,
      description,
    });
  }

  assignTicket(ticketId: string, technicianId: string): Observable<any> {
    return this.http.patch(
      `${environment.apiBase}/maintenance/tickets/${ticketId}/assign/${technicianId}`,
      {},
    );
  }

  modifyTicketStatus(ticketId: string, status: string): Observable<any> {
    return this.http.patch(`${environment.apiBase}/maintenance/tickets/${ticketId}/status`, {
      status,
    });
  }

  completeTicket(ticketId: string): Observable<any> {
    return this.http.patch(`${environment.apiBase}/maintenance/tickets/${ticketId}/complete`, {});
  }
}
