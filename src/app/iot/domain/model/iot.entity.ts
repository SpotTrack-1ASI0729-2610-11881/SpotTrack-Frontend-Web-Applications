import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export class Iot {
  private id : number;
  private equipment_id : number;
  private mac_address : string;
  private status: string;
  private last_hearbeat: string; //switch to a date format in the future

  constructor(id : number, equipment_id: number, mac_address : string, status : string, last_hearbeat: string) {
    this.id = id;
    this.equipment_id = equipment_id;
    this.mac_address = mac_address;
    this.status = status;
    this.last_hearbeat = last_hearbeat;

  }
}
