import { BaseResource } from '../../shared/infrastructure/base-response';
import {BaseResponse} from '../../shared/infrastructure/base-response';

export interface EquipmentResource extends BaseResource {
  id : number;
  zone_id: number;
  name: string;
  model : string;
  purchase_price: number;
  status: string;
}


export type EquipmentResponse = EquipmentResource[];
