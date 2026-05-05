import { Injectable } from '@angular/core';
import { Equipment, EquipmentType, EquipmentStatus } from '../domain/model/equipment.entity';
import { EquipmentResource } from './equipment.resource';

@Injectable({ providedIn: 'root' })
export class EquipmentAssembler {
  toEntityFromResource(resource: EquipmentResource): Equipment {
    const entity = new Equipment();
    Object.assign(entity, {
      _id:              resource.id,
      _name:            resource.name,
      _type:            resource.type as EquipmentType,
      _locationId:      resource.locationId,
      _sensorId:        resource.sensorId,
      _status:          resource.status as EquipmentStatus,
      _usageHours:      resource.usageHours,
      _utilizationRate: resource.utilizationRate,
      _branchId:        resource.branchId,
    });
    return entity;
  }

  toResourceFromEntity(entity: Equipment): EquipmentResource {
    return {
      id:              entity.id,
      name:            entity.name,
      type:            entity.type,
      locationId:      entity.locationId,
      sensorId:        entity.sensorId,
      status:          entity.status,
      usageHours:      entity.usageHours,
      utilizationRate: entity.utilizationRate,
      branchId:        entity.branchId,
    };
  }
}
