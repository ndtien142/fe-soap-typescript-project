import { useState } from 'react';
import {
  IBorrowReceiptDetail,
  IBorrowReceiptDetailResponse,
} from 'src/common/@types/borrow-receipt/borrowReceipt.interface';
import { ICallbackFunction } from 'src/common/@types/common.interface';
import { API_BORROW_RECEIPT } from 'src/common/constant/api.constant';
import axiosInstance from 'src/common/utils/axios';

export const useGetDetailBorrow = ({ onSuccess, onError }: ICallbackFunction) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IBorrowReceiptDetail | null>(null);

  const fetchData = async (id: string | number) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<unknown, IBorrowReceiptDetailResponse>(
        `${API_BORROW_RECEIPT}/${id}`
      );
      const detail = response.metadata?.metadata;
      setData(detail);
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, fetchData };
};
