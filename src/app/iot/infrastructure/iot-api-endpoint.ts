import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Iot } from '../domain/model/iot.entity';
import { IotResource, IotResponse } from './iot-response';
import { IotAssembler } from './iot-assembler';
import { environment } from '../../../environments/environment';

export class IotApiEndpoint extends BaseApiEndpoint<Iot, IotResource, IotResponse, IotAssembler> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.equipmentApiProvider}${environment.iotEndpoint}`,
      new IotAssembler()
    );
  }
}
