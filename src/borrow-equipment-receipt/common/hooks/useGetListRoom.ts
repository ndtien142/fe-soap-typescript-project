import { useState } from 'react';
import axiosInstance from 'src/common/utils/axios';
import { IListRoomResponse, IRoom } from 'src/common/@types/department/department.interface';
import { API_ROOM } from 'src/common/constant/api.constant';
import { ICallbackFunction, ISimpleParams } from 'src/common/@types/common.interface';

export const useGetListRoom = ({ onSuccess = () => {}, onError = () => {} }: ICallbackFunction) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IRoom[]>([]);

  const fetchData = async (params: ISimpleParams) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<unknown, IListRoomResponse>(API_ROOM, { params });
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
