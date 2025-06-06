export interface PaginationMeta {
  currentPage: number;
  itemPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface ISimpleParams {
  page?: number;
  limit?: number;
}

export type ICallbackFunction = {
  onSuccess: VoidFunction;
  onError: (message: string) => void;
};
