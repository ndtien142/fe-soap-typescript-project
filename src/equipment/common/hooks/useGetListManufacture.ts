import { useState } from 'react';
import { ICallbackFunction, ISimpleParams } from 'src/common/@types/common.interface';
import { IListManufacturerResponse } from 'src/common/@types/equipment/manufacturer.interface';
import { getListEquipmentManufacturer } from '../service';

export const useGetListManufacturer = ({ onSuccess, onError }: ICallbackFunction) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<IListManufacturerResponse['metadata']['metadata']>([]);

  const fetchData = async (params: ISimpleParams) => {
    setIsLoading(true);
    try {
      const response = await getListEquipmentManufacturer(params);
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

  return { isLoading, data, fetchData };
};
