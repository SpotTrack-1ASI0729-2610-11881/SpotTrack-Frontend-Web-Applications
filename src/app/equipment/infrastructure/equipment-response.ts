import { BaseResource } from '../../shared/infrastructure/base-response';

export interface EquipmentResource extends BaseResource {
  id : number;
  zone_id: number;
  name: string;
  model : string;
  purchase_price: number;
  status: string;
}


export interface EquipmentResponse extends Array<BaseResource> {}
