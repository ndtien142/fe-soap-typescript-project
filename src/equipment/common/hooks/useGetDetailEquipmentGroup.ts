import { useState } from 'react';
import axiosInstance from 'src/common/utils/axios';
import {
  IEquipmentGroupDetail,
  IGetEquipmentGroupDetailResponse,
} from 'src/common/@types/equipment/equipment.interface';
import { ICallbackFunction } from 'src/common/@types/common.interface';
import { API_EQUIPMENT_GROUP } from 'src/common/constant/api.constant';

export const useGetDetailEquipmentGroup = ({
  onSuccess = () => {},
  onError = () => {},
}: ICallbackFunction) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IEquipmentGroupDetail | null>(null);

  const fetchData = async (code: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<unknown, IGetEquipmentGroupDetailResponse>(
        `${API_EQUIPMENT_GROUP}/${code}`
      );
      setData(response?.metadata?.metadata || null);
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
