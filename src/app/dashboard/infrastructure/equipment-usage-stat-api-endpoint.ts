import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { EquipmentUsageStat } from '../domain/model/equipment-usage-stat.entity';
import {
  EquipmentUsageStatResource,
  EquipmentUsageStatResponse,
} from './dashboard-response';
import { EquipmentUsageStatAssembler } from './equipment-usage-stat-assembler';
import { environment } from '../../../environments/environment';

export class EquipmentUsageStatApiEndpoint extends BaseApiEndpoint<
  EquipmentUsageStat,
  EquipmentUsageStatResource,
  EquipmentUsageStatResponse,
  EquipmentUsageStatAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.apiBase}/equipment-usage-stats`,
      new EquipmentUsageStatAssembler()
    );
  }
}
