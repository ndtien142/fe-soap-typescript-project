import { useState } from 'react';
import {
  IDetailEquipmentSerialResponse,
  IEquipmentDetailBySerial,
} from 'src/common/@types/equipment/equipment.interface';
import { API_EQUIPMENT } from 'src/common/constant/api.constant';
import axiosInstance from 'src/common/utils/axios';

interface IUseGetDetailEquipmentBySerialOptions {
  onSuccess?: (data: IEquipmentDetailBySerial) => void;
  onError?: (message: string) => void;
}

export const useGetDetailEquipmentBySerial = ({
  onSuccess = () => {},
  onError = () => {},
}: IUseGetDetailEquipmentBySerialOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IEquipmentDetailBySerial | null>(null);

  const fetchData = async (serialNumber: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<unknown, IDetailEquipmentSerialResponse>(
        `${API_EQUIPMENT}/${serialNumber}`
      );
      const detail = response?.metadata?.metadata;
      setData(detail);
      onSuccess(detail);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, fetchData };
};
