import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Iot } from '../domain/model/iot.entity';
import { IotApiEndpoint } from './iot-api-endpoint';

@Injectable({ providedIn: 'root' })
export class IotApi extends BaseApi {
  private readonly endpoint: IotApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.endpoint = new IotApiEndpoint(http);
  }

  getDevices(): Observable<Iot[]>              { return this.endpoint.getAll(); }
  getDeviceById(id: number): Observable<Iot>   { return this.endpoint.getById(id); }
  registerDevice(entity: Iot): Observable<Iot> { return this.endpoint.create(entity); }
  updateDevice(entity: Iot): Observable<Iot>   { return this.endpoint.update(entity, entity.id); }
  deleteDevice(id: number): Observable<void>   { return this.endpoint.delete(id); }
}
