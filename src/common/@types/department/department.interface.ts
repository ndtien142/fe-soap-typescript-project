import { PaginationMeta } from '../common.interface';

export interface IRoomOfBorrowReceipt {
  roomId: string;
  roomName: string;
  roomStatus: boolean;
  department: IDepartmentDepartMentOfBOrrowReceipt;
}

export interface IDepartmentDepartMentOfBOrrowReceipt {
  departmentId: string;
  departmentName: string;
}

export interface IRoom {
  id: string;
  name: string;
  department: IDepartmentOfRoom;
}

export interface IDepartmentOfRoom {
  id: string;
  name: string;
}

export interface IListRoomResponse {
  status: number;
  message: string;
  metadata: {
    code: number;
    metadata: IRoom[];
    meta: PaginationMeta;
  };
}
