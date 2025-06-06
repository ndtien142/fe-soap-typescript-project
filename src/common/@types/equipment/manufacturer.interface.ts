import { PaginationMeta } from '../common.interface';

export interface IManufacturer {
  id: number;
  name: string;
  prefix: string;
  contactInfo: string;
  address: string;
  isActive: string;
}

export interface IListManufacturerResponse {
  code: number;
  message: string;
  metadata: {
    status: number;
    metadata: IManufacturer[];
    meta: PaginationMeta;
  };
}
