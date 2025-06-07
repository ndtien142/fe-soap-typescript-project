import { useState } from 'react';
import { ICallbackFunction, ISimpleParams } from 'src/common/@types/common.interface';
import { IListEquipmentTypeResponse } from 'src/common/@types/equipment/equipmentType.interface';
import { getListTypeEquipment } from '../service';

export const useGetListEquipmentType = ({ onSuccess, onError }: ICallbackFunction) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<IListEquipmentTypeResponse['metadata']['metadata']>([]);

  const fetchData = async (params: ISimpleParams) => {
    setIsLoading(true);
    try {
      const response = await getListTypeEquipment(params);
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
