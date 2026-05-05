import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Equipment } from '../domain/model/equipment.entity';
import { EquipmentResource, EquipmentResponse } from './equipment-response';

export class EquipmentAssembler implements BaseAssembler<Equipment, EquipmentResource, EquipmentResponse>{

}
