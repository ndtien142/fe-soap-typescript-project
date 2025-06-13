import { useState } from 'react';
import axiosInstance from 'src/common/utils/axios';

export interface IUserRole {
  id: number;
  name: string;
}

export interface IUser {
  userCode: string;
  username: string;
  isActive: boolean;
  isBlock: boolean;
  role: IUserRole;
  profiles: any[];
}

export interface IUserListResponse {
  message: string;
  status: number;
  metadata: {
    items: IUser[];
    meta: {
      currentPage: number;
      itemPerPage: number;
      totalPages: number;
      totalItems: number;
    };
  };
}

export const useGetAllUser = ({
  onSuccess = () => {},
  onError = () => {},
}: {
  onSuccess?: (data: IUser[]) => void;
  onError?: (error: string) => void;
} = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IUser[]>([]);

  const fetchData = async (params?: Record<string, any>) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<unknown, IUserListResponse>('/user', { params });
      setData(response.metadata.items);
      onSuccess(response.metadata.items);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, fetchData };
};
