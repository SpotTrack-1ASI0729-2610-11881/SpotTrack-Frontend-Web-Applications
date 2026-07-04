import { BaseResource } from '../../shared/infrastructure/base-response';

export interface EquipmentUsageStatResource extends BaseResource {
  id:                   number;
  equipment_id:         number;
  total_usage_hours:    number;
  usage_count_daily:    number;
  estimated_wear_level: number;
}

export type EquipmentUsageStatResponse = EquipmentUsageStatResource[];

export interface UsageSessionResource extends BaseResource {
  id:                  number;
  equipment_id:        number;
  start_time:          string;
  end_time:            string;
  calories_burned_est: number;
}

export type UsageSessionResponse = UsageSessionResource[];
