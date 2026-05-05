export enum EquipmentType {
  CARDIO = 'CARDIO',
  STRENGTH = 'STRENGTH',
  FUNCTIONAL = 'FUNCTIONAL'
}

export enum EquipmentStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  INACTIVE = 'INACTIVE'
}

export class Equipment  {
  private _id: string;
  private _name: string;
  private _type: EquipmentType;
  private _locationId: string;
  private _sensorId: string;
  private _status: EquipmentStatus;
  private _usageHours: number;
  private _utilizationRate: number;
  private _branchId: string;

  constructor() {
    this._id = '';
    this._name = '';
    this._type = EquipmentType.CARDIO;
    this._locationId = '';
    this._sensorId = '';
    this._status = EquipmentStatus.ACTIVE;
    this._usageHours = 0;
    this._utilizationRate = 0;
    this._branchId = '';
  }

  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get type(): EquipmentType { return this._type; }
  get locationId(): string { return this._locationId; }
  get sensorId(): string { return this._sensorId; }
  get status(): EquipmentStatus { return this._status; }
  get usageHours(): number { return this._usageHours; }
  get utilizationRate(): number { return this._utilizationRate; }
  get branchId(): string { return this._branchId; }
}
