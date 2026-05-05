import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Iot, IotStatus } from '../domain/model/iot.entity';
import { IotResource, IotResponse } from './iot-response';

export class IotAssembler implements BaseAssembler<Iot, IotResource, IotResponse> {
  toEntitiesFromResponse(response: IotResponse): Iot[] {
    return response.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: IotResource): Iot {
    return new Iot({
      id:            resource.id,
      equipmentId:   resource.equipment_id,
      macAddress:    resource.mac_address,
      status:        resource.status as IotStatus,
      lastHeartbeat: resource.last_heartbeat,
    });
  }

  toResourceFromEntity(entity: Iot): IotResource {
    return {
      id:             entity.id,
      equipment_id:   entity.equipmentId,
      mac_address:    entity.macAddress,
      status:         entity.status,
      last_heartbeat: entity.lastHeartbeat,
    };
  }
}
