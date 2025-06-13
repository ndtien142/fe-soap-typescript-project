import { IRoom } from '../department/department.interface';

export interface IListTransferReceiptResponse {
  status: number;
  message: string;
  metadata: {
    code: number;
    metadata: ITransferReceipts[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
    };
  };
}
export interface ITransferReceipts {
  id: number;
  transferDate: string;
  transferFrom: IRoom;
  transferTo: IRoom;
  user: User;
  status: string;
}

export interface User {
  id: number;
  username: string;
  email: string | null;
  isActive: boolean;
}
export interface ITransferReceiptParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  transferDate?: string;
  transferFromId?: number;
  transferToId?: number;
  userId?: number;
  status?: string;
  searchText?: string;
  searchCode?: string;
  searchSupplier?: string;
  searchStatus?: string;
  startDate?: string;
  endDate?: string;
}

export interface IEquipmentInTransfer {
  serialNumber: string;
  name: string;
  type: { id: number; name: string };
  description: string;
  status: string;
  images: string[];
}

export interface ITransferItemForm {
  serialNumber: string;
  notes: string;
}
