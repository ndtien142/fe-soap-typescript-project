import { useState } from 'react';
import { ICallbackFunction } from 'src/common/@types/common.interface';
import {
  IImportReceipt,
  IImportReceiptParams,
} from 'src/common/@types/import-receipt/import-receipt.interface';
import { getListImportReceipts } from '../service';

export const useGetListImportReceipts = ({ onSuccess, onError }: ICallbackFunction) => {
  const [data, setData] = useState<IImportReceipt[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (params: IImportReceiptParams) => {
    setIsLoading(true);
    try {
      const response = await getListImportReceipts(params);
      if (!response) throw new Error('No response');
      setData(response.metadata.metadata);
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, fetchData };
};
