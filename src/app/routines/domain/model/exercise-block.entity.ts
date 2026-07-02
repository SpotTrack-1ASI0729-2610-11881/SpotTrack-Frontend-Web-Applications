import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export enum ExerciseType {
  CARDIO      = 'CARDIO',
  STRENGTH    = 'STRENGTH',
  FLEXIBILITY = 'FLEXIBILITY',
}

export class ExerciseBlock implements BaseEntity {
  private _id:           number;
  private _exerciseName: string;
  private _exerciseType: ExerciseType;
  private _order:        number;

  constructor(props: {
    id:           number;
    exerciseName: string;
    exerciseType: ExerciseType;
    order:        number;
  }) {
    this._id           = props.id;
    this._exerciseName = props.exerciseName;
    this._exerciseType = props.exerciseType;
    this._order        = props.order;
  }

  get id():           number       { return this._id; }
  get exerciseName(): string       { return this._exerciseName; }
  get exerciseType(): ExerciseType { return this._exerciseType; }
  get order():        number       { return this._order; }
}
