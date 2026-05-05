// Equipment uses string IDs, so it does not extend BaseApiEndpoint (which requires numeric ids).
// All HTTP operations are provided by EquipmentApi.
export { EquipmentApi as EquipmentApiEndpoint } from './equipment.api';
