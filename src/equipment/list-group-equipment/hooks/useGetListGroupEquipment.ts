import { useState } from 'react';
import { ICallbackFunction } from 'src/common/@types/common.interface';
import { IGroupEquipmentParams, IGroupEquipmentResponse } from '../equipmentGroup.interface';
import { getListEquipmentGroup } from 'src/equipment/common/service';

export const useGetListEquipmentGroup = ({ onSuccess, onError }: ICallbackFunction) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<IGroupEquipmentResponse['metadata']['metadata']>([]);

  const fetchData = async (params: IGroupEquipmentParams) => {
    setIsLoading(true);
    try {
      const response = await getListEquipmentGroup(params);
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
