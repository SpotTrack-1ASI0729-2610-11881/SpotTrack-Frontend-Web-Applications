import { Injectable } from '@angular/core';
import { Equipment, EquipmentStatus } from '../domain/model/equipment.entity';
import { EquipmentResource } from './equipment.resource';

@Injectable({ providedIn: 'root' })
export class EquipmentAssembler {
  toEntityFromResource(resource: EquipmentResource): Equipment {
    return new Equipment({
      id:            resource.id,
      zoneId:        resource.zone_id,
      name:          resource.name,
      brand:         resource.brand,
      model:         resource.model,
      purchasePrice: resource.purchase_price,
      status:        resource.status as EquipmentStatus,
    });
  }

  toResourceFromEntity(entity: Equipment): EquipmentResource {
    return {
      id:             entity.id,
      zone_id:        entity.zoneId,
      name:           entity.name,
      brand:          entity.brand,
      model:          entity.model,
      purchase_price: entity.purchasePrice,
      status:         entity.status,
    };
  }
}
