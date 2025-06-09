// src/common/hooks/useGetListSuppliers.ts
import { useState } from 'react';
import { ISupplier } from 'src/common/@types/import-receipt/supplier.interface';
import { getListSupplier } from '../service';
import { ICallbackFunction, ISimpleParams } from 'src/common/@types/common.interface';

export const useGetListSuppliers = ({ onSuccess, onError }: ICallbackFunction) => {
  const [data, setData] = useState<ISupplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (params: ISimpleParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getListSupplier(params);
      if (!response) throw new Error('No response from server');

      setData(response.metadata.metadata);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi lấy danh sách supplier');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    fetchData,
  };
};
