import { PaginationMeta } from 'src/common/@types/common.interface';

export interface IGroupEquipmentParams {
  page: number;
  limit: number;
  searchText?: string;
  createdDate?: string;
  status?: string;
}

export interface IGroupEquipmentResponse {
  message: string;
  status: number;
  metadata: IGroupEquipmentMetadata;
}

export interface IGroupEquipmentMetadata {
  code: number;
  message: string;
  metadata: IGroupEquipment[];
  meta: PaginationMeta;
}

export interface IGroupEquipment {
  code: string;
  name: string;
  unitOfMeasure: {
    id: number;
    name: string;
  };
  type: {
    id: number;
    name: string;
  };
  manufacturer: {
    id: number;
    name: string;
  };
  equipmentStatusCounts: {
    [status: string]: number;
  };
  isDeleted: boolean;
  isActive: boolean;
}
