import { ISimpleParams } from "src/common/@types/common.interface";
import {
  ITransferReceiptParams,
  IListTransferReceiptResponse,
} from "src/common/@types/transfer-receipt/transfer-receipt.interface";
import { API_TRANSFER_RECEIPT } from "src/common/constant/api.constant";
import axiosInstance from "src/common/utils/axios";
export const getListTransferReceipts = (params: ITransferReceiptParams) =>
  axiosInstance.get<unknown, IListTransferReceiptResponse>(API_TRANSFER_RECEIPT, { params });
