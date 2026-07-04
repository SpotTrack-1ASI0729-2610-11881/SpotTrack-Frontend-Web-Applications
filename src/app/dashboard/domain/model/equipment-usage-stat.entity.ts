import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export class EquipmentUsageStat implements BaseEntity {
  private _id:                 number;
  private _equipmentId:        number;
  private _totalUsageHours:    number;
  private _usageCountDaily:    number;
  private _estimatedWearLevel: number;

  constructor(props: {
    id:                 number;
    equipmentId:        number;
    totalUsageHours:    number;
    usageCountDaily:    number;
    estimatedWearLevel: number;
  }) {
    this._id                 = props.id;
    this._equipmentId        = props.equipmentId;
    this._totalUsageHours    = props.totalUsageHours;
    this._usageCountDaily    = props.usageCountDaily;
    this._estimatedWearLevel = props.estimatedWearLevel;
  }

  get id():                 number { return this._id; }
  set id(v:                 number) { this._id = v; }
  get equipmentId():        number { return this._equipmentId; }
  get totalUsageHours():    number { return this._totalUsageHours; }
  get usageCountDaily():    number { return this._usageCountDaily; }
  get estimatedWearLevel(): number { return this._estimatedWearLevel; }
}
