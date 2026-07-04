import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { EquipmentUsageStat } from '../domain/model/equipment-usage-stat.entity';
import {
  EquipmentUsageStatResource,
  EquipmentUsageStatResponse,
} from './dashboard-response';

export class EquipmentUsageStatAssembler
  implements BaseAssembler<EquipmentUsageStat, EquipmentUsageStatResource, EquipmentUsageStatResponse>
{
  toEntitiesFromResponse(response: EquipmentUsageStatResponse): EquipmentUsageStat[] {
    return response.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(r: EquipmentUsageStatResource): EquipmentUsageStat {
    return new EquipmentUsageStat({
      id:                 r.id,
      equipmentId:        r.equipment_id,
      totalUsageHours:    r.total_usage_hours,
      usageCountDaily:    r.usage_count_daily,
      estimatedWearLevel: r.estimated_wear_level,
    });
  }

  toResourceFromEntity(e: EquipmentUsageStat): EquipmentUsageStatResource {
    return {
      id:                   e.id,
      equipment_id:         e.equipmentId,
      total_usage_hours:    e.totalUsageHours,
      usage_count_daily:    e.usageCountDaily,
      estimated_wear_level: e.estimatedWearLevel,
    };
  }
}
