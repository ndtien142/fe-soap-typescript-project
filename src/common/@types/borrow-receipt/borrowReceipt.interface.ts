import { PaginationMeta } from '../common.interface';
import { IRoomOfBorrowReceipt } from '../department/department.interface';

export interface IBorrowReceipt {
  id: number;
  userCode: string;
  borrowDate: string | null;
  createdTime: string;
  returnDate: string | null;
  status: string;
  note: string;
  room: IRoomOfBorrowReceipt;
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

export interface IBorrowReceiptRequest {
  borrowDate: string;
  returnDate: string;
  note?: string;
  roomId: string;
  type: 'specific' | 'random';
  groups: {
    groupEquipmentCode: string;
    quantity: number;
  }[];
}

export interface IBorrowReceiptDetail {
  id: number;
  userCode: string;
  returnDate: string | null;
  status: string;
  note: string;
  room: IRoomOfBorrowReceipt;
  requestedBy: {
    userCode: string;
    username: string;
    phone: string | null;
    email: string | null;
  };
  borrowEquipments: {
    serialNumber: string;
    groupEquipmentCode: string;
    status: string;
  }[];
  requestItems: {
    groupEquipmentCode: string;
    name: string;
    quantity: number;
    note: string | null;
    type: {
      id: number;
      name: string;
      description: string;
    };
    manufacturer: {
      id: number;
      name: string;
      contactInfo: string;
      address: string;
    };
  }[];
}

export interface IBorrowReceiptDetailResponse {
  status: number;
  message: string;
  metadata: {
    code: number;
    message: string;
    metadata: IBorrowReceiptDetail;
  };
}
