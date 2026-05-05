import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export enum IotStatus {
  ACTIVE   = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class Iot implements BaseEntity {
  private _id:            number;
  private _equipmentId:   number;
  private _macAddress:    string;
  private _status:        IotStatus;
  private _lastHeartbeat: string;

  constructor(props: {
    id:            number;
    equipmentId:   number;
    macAddress:    string;
    status:        IotStatus;
    lastHeartbeat: string;
  }) {
    this._id            = props.id;
    this._equipmentId   = props.equipmentId;
    this._macAddress    = props.macAddress;
    this._status        = props.status;
    this._lastHeartbeat = props.lastHeartbeat;
  }

  get id():            number    { return this._id; }
  set id(value:        number)   { this._id = value; }

  get equipmentId():   number    { return this._equipmentId; }
  set equipmentId(value: number) { this._equipmentId = value; }

  get macAddress():    string    { return this._macAddress; }
  set macAddress(value: string)  { this._macAddress = value; }

  get status():        IotStatus { return this._status; }
  set status(value:    IotStatus){ this._status = value; }

  get lastHeartbeat(): string    { return this._lastHeartbeat; }
  set lastHeartbeat(value: string) { this._lastHeartbeat = value; }
}
