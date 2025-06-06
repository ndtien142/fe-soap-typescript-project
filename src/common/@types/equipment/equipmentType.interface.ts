import { PaginationMeta } from '../common.interface';

export interface IEquipmentType {
  id: number;
  name: string;
  description: string;
  prefix: string;
  isActive: boolean;
}

export interface IListEquipmentTypeResponse {
  code: number;
  message: string;
  metadata: {
    status: number;
    metadata: IEquipmentType[];
    meta: PaginationMeta;
  };
}
