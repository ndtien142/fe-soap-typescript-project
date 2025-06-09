import { useState, useCallback } from 'react';
import { API_IMPORT_RECEIPT } from 'src/common/constant/api.constant';
import axiosInstance from 'src/common/utils/axios';
import {
  IImportReceiptDetail,
  IImportReceiptDetailResponse,
} from 'src/common/@types/import-receipt/import-receipt-detail.interface';

export function useGetDetailImportReceipt() {
  const [data, setData] = useState<IImportReceiptDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchDetail = useCallback(async (id: number | string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get<unknown, IImportReceiptDetailResponse>(
        `${API_IMPORT_RECEIPT}/${id}`
      );
      setData(res?.metadata?.metadata);
    } catch (err) {
      setError(err);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchDetail,
  };
}
