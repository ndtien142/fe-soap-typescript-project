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
  transferFrom: Room;
  transferTo: Room;
  user: User;
  status: string;
}

export interface Room {
  id: number;
  name: string;
  department: Department;
}

export interface Department {
  id: number;
  name: string;
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


