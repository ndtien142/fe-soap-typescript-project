import { useEffect, useState, useCallback } from 'react';
import {
  ILiquidationReceipt,
  IListLiquidationReceiptResponse,
} from 'src/common/@types/liquidation-receipt/liquidationReceipt.interface';
import { API_LIQUIDATION_RECEIPT } from 'src/common/constant/api.constant';
import axios from 'src/common/utils/axios';

interface FetchParams {
  page?: number;
  limit?: number;
  status?: string;
  searchText?: string;
  [key: string]: any;
}

export function useGetListLiquidationReceipt(params?: FetchParams) {
  const [data, setData] = useState<ILiquidationReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async (fetchParams?: FetchParams) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        page: String(fetchParams?.page || 1),
        limit: String(fetchParams?.limit || 20),
        ...(fetchParams?.status ? { status: fetchParams.status } : {}),
        ...(fetchParams?.searchText ? { searchText: fetchParams.searchText } : {}),
      }).toString();

      const res = await axios.get<unknown, IListLiquidationReceiptResponse>(
        `${API_LIQUIDATION_RECEIPT}?${query}`
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
