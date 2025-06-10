import { useEffect, useState, useCallback } from 'react';
import {
  IBorrowReceipt,
  IListBorrowReceiptResponse,
} from 'src/common/@types/borrow-receipt/borrowReceipt.interface';
import { API_BORROW_RECEIPT } from 'src/common/constant/api.constant';
import axios from 'src/common/utils/axios';

interface FetchParams {
  page?: number;
  limit?: number;
  searchText?: string;
  status?: string;
  [key: string]: any;
}

export function useGetListBorrowReceipt(params?: FetchParams) {
  const [data, setData] = useState<IBorrowReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async (fetchParams?: FetchParams) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        page: String(fetchParams?.page || 1),
        limit: String(fetchParams?.limit || 20),
        ...(fetchParams?.searchText ? { searchText: fetchParams.searchText } : {}),
        ...(fetchParams?.status ? { status: fetchParams.status } : {}),
      }).toString();

      const res = await axios.get<unknown, IListBorrowReceiptResponse>(
        `${API_BORROW_RECEIPT}?${query}`
      );
      setData(res.metadata?.metadata || []);
    } catch (err) {
      setError(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
}
