import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface IotResource extends BaseResource {
  id:             number;
  equipment_id:   number;
  mac_address:    string;
  status:         string;
  last_heartbeat: string;
}

export type IotResponse = IotResource[];
