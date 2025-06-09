import { useState, useCallback } from 'react';
import { API_IMPORT_RECEIPT } from 'src/common/constant/api.constant';
import axiosInstance from 'src/common/utils/axios';
import {
  IImportReceiptDetail,
  IImportReceiptDetailResponse,
} from 'src/common/@types/import-receipt/import-receipt-detail.interface';

export function useGetDetailImportReceipt() {
  const [data, setData] = useState<IImportReceiptDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchDetail = useCallback(async (id: number | string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get<unknown, IImportReceiptDetailResponse>(
        `${API_IMPORT_RECEIPT}/${id}`
      );
      console.log('Import Receipt Detail Response:', res?.metadata?.metadata);
      setData(res?.metadata?.metadata);
    } catch (err) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchDetail,
  };
}
