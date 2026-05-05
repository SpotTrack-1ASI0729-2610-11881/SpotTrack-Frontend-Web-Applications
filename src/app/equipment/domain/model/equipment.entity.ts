export enum EquipmentStatus {
  OPERATIONAL = 'OPERATIONAL',
  MAINTENANCE  = 'MAINTENANCE',
  OUT_OF_ORDER = 'OUT_OF_ORDER'
}

export interface EquipmentData {
  id:            number;
  zoneId:        number;
  name:          string;
  brand:         string;
  model:         string;
  purchasePrice: number;
  status:        EquipmentStatus;
}

export class Equipment {
  private _id:            number;
  private _zoneId:        number;
  private _name:          string;
  private _brand:         string;
  private _model:         string;
  private _purchasePrice: number;
  private _status:        EquipmentStatus;

  constructor(data: Partial<EquipmentData> = {}) {
    this._id            = data.id            ?? 0;
    this._zoneId        = data.zoneId        ?? 0;
    this._name          = data.name          ?? '';
    this._brand         = data.brand         ?? '';
    this._model         = data.model         ?? '';
    this._purchasePrice = data.purchasePrice ?? 0;
    this._status        = data.status        ?? EquipmentStatus.OPERATIONAL;
  }

  get id():            number          { return this._id; }
  get zoneId():        number          { return this._zoneId; }
  get name():          string          { return this._name; }
  get brand():         string          { return this._brand; }
  get model():         string          { return this._model; }
  get purchasePrice(): number          { return this._purchasePrice; }
  get status():        EquipmentStatus { return this._status; }
}
