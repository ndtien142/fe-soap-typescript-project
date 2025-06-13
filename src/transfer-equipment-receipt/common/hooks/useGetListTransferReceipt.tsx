import { useState } from 'react';
import { ICallbackFunction } from 'src/common/@types/common.interface';
import {
  ITransferReceipts,
  ITransferReceiptParams,
} from 'src/common/@types/transfer-receipt/transfer-receipt.interface';
import { getListTransferReceipts } from '../service';

export const useGetListTransferReceipts = ({ onSuccess, onError }: ICallbackFunction) => {
  const [data, setData] = useState<ITransferReceipts[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (params: ITransferReceiptParams) => {
    setIsLoading(true);
    try {
      const response = await getListTransferReceipts(params);
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
