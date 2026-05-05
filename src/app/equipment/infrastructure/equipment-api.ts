import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Equipment } from '../domain/model/equipment.entity';
import { EquipmentApiEndpoint } from './equipment-api-endpoint';

@Injectable({ providedIn: 'root' })
export class EquipmentApi extends BaseApi {
  private readonly endpoint: EquipmentApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.endpoint = new EquipmentApiEndpoint(http);
  }

  getEquipment(): Observable<Equipment[]> {
    return this.endpoint.getAll();
  }

  registerEquipment(entity: Equipment): Observable<Equipment> {
    return this.endpoint.create(entity);
  }

  updateEquipment(entity: Equipment): Observable<Equipment> {
    return this.endpoint.update(entity, entity.id);
  }

  deleteEquipment(id: number): Observable<void> {
    return this.endpoint.delete(id);
  }
}
