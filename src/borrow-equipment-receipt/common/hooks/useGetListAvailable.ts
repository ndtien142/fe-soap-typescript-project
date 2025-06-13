import { useState } from 'react';
import axiosInstance from 'src/common/utils/axios';
import { API_BORROW_RECEIPT } from 'src/common/constant/api.constant';
import {
  IAvailableGroupEquipment,
  IListAvailableResponse,
} from 'src/common/@types/borrow-receipt/borrowReceipt.interface';
import { ICallbackFunction } from 'src/common/@types/common.interface';

export const useGetListAvailable = ({ onSuccess, onError }: ICallbackFunction) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IAvailableGroupEquipment[]>([]);
  const [allAvailable, setAllAvailable] = useState<boolean>(false);

  const fetchData = async (borrowReceiptId: string | number) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<unknown, IListAvailableResponse>(
        `${API_BORROW_RECEIPT}/${borrowReceiptId}/list-available`
      );
      const listData = response?.metadata?.metadata;
      setData(Array.isArray(listData) ? listData : []);
      setAllAvailable(response?.metadata?.allAvailable ?? false);
      onSuccess && onSuccess();
    } catch (error: any) {
      onError && onError(error?.message || 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, allAvailable, fetchData };
};
