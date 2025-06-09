import { PaginationMeta } from '../common.interface';
import { IRoom } from '../department/deparment.interface';

export interface IBorrowReceipt {
  id: number;
  userCode: string;
  borrowDate: string | null;
  createdTime: string;
  returnDate: string | null;
  status: string;
  note: string;
  room: IRoom;
  requestedBy: IRequestUser;
  requestItems: IBorrowReceiptItem[];
}

export interface IBorrowReceiptItem {
  groupEquipmentCode: string;
  name: string;
  quantity: number;
  note: string | null;
  type: IEquipmentType;
  manufacturer: IManufacturer;
}

export interface IRequestUser {
  userCode: string;
  username: string;
  phone: string | null;
  email: string | null;
}

export interface IEquipmentType {
  id: number;
  name: string;
  description: string;
}

export interface IManufacturer {
  id: number;
  name: string;
  contactInfo: string;
  address: string;
}

export interface IListBorrowReceiptResponse {
  status: number;
  message: string;
  metadata: {
    code: number;
    metadata: IBorrowReceipt[];
    meta: PaginationMeta;
  };
}
