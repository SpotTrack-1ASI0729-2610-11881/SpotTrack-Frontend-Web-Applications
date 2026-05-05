import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Equipment } from '../domain/model/equipment.entity';
import { EquipmentResource, EquipmentResponse } from './equipment-response';
import { EquipmentAssembler } from './equipment-assembler';
import { environment } from '../../../environments/environment';

export class EquipmentApiEndpoint extends BaseApiEndpoint<Equipment, EquipmentResource, EquipmentResponse, EquipmentAssembler> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.equipmentApiProvider}${environment.equipmentEnpoints}`,
      new EquipmentAssembler()
    );
  }

  override create(entity: Equipment): Observable<Equipment> {
    const { id: _id, ...body } = this.assembler.toResourceFromEntity(entity);
    return this.http.post<EquipmentResource>(this.endpointUrl, body).pipe(
      map(created => this.assembler.toEntityFromResource(created)),
      catchError(this.handleError('Failed to create equipment'))
    );
  }
}
