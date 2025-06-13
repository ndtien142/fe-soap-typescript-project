import { useState } from 'react';
import { API_TRANSFER_RECEIPT } from 'src/common/constant/api.constant';
import axiosInstance from 'src/common/utils/axios';

export interface IEquipmentType {
  id: number;
  name: string;
}

export interface IEquipment {
  serialNumber: string;
  name: string;
  type: IEquipmentType;
  description: string;
  status: string;
  images: string[];
}

export interface IListEquipmentInRoomResponse {
  message: string;
  status: number;
  metadata: {
    code: number;
    message: string;
    metadata: IEquipment[];
  };
}

export const useGetListEquipmentInRoom = ({
  onSuccess = () => {},
  onError = () => {},
}: {
  onSuccess?: (data: IEquipment[]) => void;
  onError?: (error: string) => void;
} = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IEquipment[]>([]);

  const fetchData = async (roomId: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<unknown, IListEquipmentInRoomResponse>(
        `${API_TRANSFER_RECEIPT}/room/${roomId}/equipment`
      );
      setData(response.metadata.metadata);
      onSuccess(response.metadata.metadata);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, fetchData };
};
