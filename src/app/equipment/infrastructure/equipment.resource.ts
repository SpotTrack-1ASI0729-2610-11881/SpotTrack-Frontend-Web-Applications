export interface EquipmentResource {
  id:              string;
  name:            string;
  type:            string;
  locationId:      string;
  sensorId:        string;
  status:          string;
  usageHours:      number;
  utilizationRate: number;
  branchId:        string;
}
