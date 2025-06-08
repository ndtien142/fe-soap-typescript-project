import { ISimpleParams } from 'src/common/@types/common.interface';
import {
  IImportReceiptParams,
  IListImportReceiptResponse,
} from 'src/common/@types/import-receipt/import-receipt.interface';
import { IListSupplierResponse } from 'src/common/@types/import-receipt/supplier.interface';
import { API_IMPORT_RECEIPT, API_SUPPLIER } from 'src/common/constant/api.constant';
import axiosInstance from 'src/common/utils/axios';

export const getListImportReceipts = (params: IImportReceiptParams) =>
  axiosInstance.get<unknown, IListImportReceiptResponse>(API_IMPORT_RECEIPT, { params });

export const getListSupplier = (params: ISimpleParams) =>
  axiosInstance.get<unknown, IListSupplierResponse>(`${API_SUPPLIER}`, {
    params,
  });
