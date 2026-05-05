export interface EquipmentResource {
  id:             number;
  zone_id:        number;
  name:           string;
  brand:          string;
  model:          string;
  purchase_price: number;
  status:         string;
}

// json-server returns a plain array — no envelope wrapper
export type EquipmentResponse = EquipmentResource[];
