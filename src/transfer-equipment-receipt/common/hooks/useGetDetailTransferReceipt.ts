import { useState } from 'react';
import {
  IDetailTransferReceiptResponse,
  ITransferReceipts,
} from 'src/common/@types/transfer-receipt/transfer-receipt.interface';
import axiosInstance from 'src/common/utils/axios';
import { API_TRANSFER_RECEIPT } from 'src/common/constant/api.constant';

export function useGetDetailTransferReceipt() {
  const [data, setData] = useState<(ITransferReceipts & { items?: any[] }) | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDetail = async (id: number | string) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get<unknown, IDetailTransferReceiptResponse>(
        `${API_TRANSFER_RECEIPT}/${id}`
      );
      // API: res.metadata.metadata is the detail object

      const detail = res.metadata.metadata ? res.metadata.metadata : null;
      setData(detail);
    } catch (e) {
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, fetchDetail };
}
