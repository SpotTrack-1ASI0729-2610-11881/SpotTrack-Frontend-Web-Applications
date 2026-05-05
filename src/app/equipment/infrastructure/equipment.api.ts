import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Equipment } from '../domain/model/equipment.entity';
import { EquipmentResource } from './equipment.resource';
import { EquipmentAssembler } from './equipment.assembler';

const BASE_URL = 'http://localhost:3000/equipment';

@Injectable({ providedIn: 'root' })
export class EquipmentApi extends BaseApi {
  private http       = inject(HttpClient);
  private assembler  = inject(EquipmentAssembler);

  getEquipment(): Observable<Equipment[]> {
    return this.http.get<EquipmentResource[]>(BASE_URL).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r)))
    );
  }

  registerEquipment(entity: Equipment): Observable<Equipment> {
    const resource = this.assembler.toResourceFromEntity(entity);
    return this.http.post<EquipmentResource>(BASE_URL, resource).pipe(
      map(r => this.assembler.toEntityFromResource(r))
    );
  }

  updateEquipment(entity: Equipment): Observable<Equipment> {
    const resource = this.assembler.toResourceFromEntity(entity);
    return this.http.put<EquipmentResource>(`${BASE_URL}/${resource.id}`, resource).pipe(
      map(r => this.assembler.toEntityFromResource(r))
    );
  }

  deleteEquipment(equipmentId: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${equipmentId}`);
  }
}
