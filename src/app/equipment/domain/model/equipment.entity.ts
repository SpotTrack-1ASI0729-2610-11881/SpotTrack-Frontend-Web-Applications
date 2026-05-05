import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export enum EquipmentStatus {
  OPERATIONAL = 'OPERATIONAL',
  MAINTENANCE  = 'MAINTENANCE',
  OUT_OF_ORDER = 'OUT_OF_ORDER',
}

export class Equipment implements BaseEntity {
  private _id:            number;
  private _zoneId:        number;
  private _name:          string;
  private _brand:         string;
  private _model:         string;
  private _purchasePrice: number;
  private _status:        EquipmentStatus;

  constructor(props: {
    id:            number;
    zoneId:        number;
    name:          string;
    brand:         string;
    model:         string;
    purchasePrice: number;
    status:        EquipmentStatus;
  }) {
    this._id            = props.id;
    this._zoneId        = props.zoneId;
    this._name          = props.name;
    this._brand         = props.brand;
    this._model         = props.model;
    this._purchasePrice = props.purchasePrice;
    this._status        = props.status;
  }

  get id():            number          { return this._id; }
  set id(value:        number)         { this._id = value; }

  get zoneId():        number          { return this._zoneId; }
  set zoneId(value:    number)         { this._zoneId = value; }

  get name():          string          { return this._name; }
  set name(value:      string)         { this._name = value; }

  get brand():         string          { return this._brand; }
  set brand(value:     string)         { this._brand = value; }

  get model():         string          { return this._model; }
  set model(value:     string)         { this._model = value; }

  get purchasePrice(): number          { return this._purchasePrice; }
  set purchasePrice(value: number)     { this._purchasePrice = value; }

  get status():        EquipmentStatus { return this._status; }
  set status(value:    EquipmentStatus){ this._status = value; }
}
