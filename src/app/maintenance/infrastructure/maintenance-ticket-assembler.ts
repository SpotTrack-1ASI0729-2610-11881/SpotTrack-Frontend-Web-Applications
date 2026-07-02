import { MaintenanceTicket, TicketStatus, TicketPriority, TicketType } from '../domain/model/maintenance-ticket.entity';
import { MaintenanceTicketResource } from './maintenance-response';

export class MaintenanceTicketAssembler {
  toEntityFromResource(r: MaintenanceTicketResource): MaintenanceTicket {
    return new MaintenanceTicket({
      id:          r.id,
      equipmentId: r.equipmentId,
      status:      (r.ticketStatus as TicketStatus) || TicketStatus.OPEN,
      priority:    (r.priority as TicketPriority) || TicketPriority.MEDIUM,
      type:        (r.type as TicketType) || TicketType.CORRECTIVE,
      createdAt:   r.createdAt,
      description: r.description,
      assignee:    r.technicianId ?? '',
      completedBy: '',
    });
  }
}
