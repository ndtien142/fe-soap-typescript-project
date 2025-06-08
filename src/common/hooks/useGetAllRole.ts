import { useQuery } from 'react-query';
import axiosInstance from '../utils/axios';
import { API_ROLE } from '../constant/api.constant';
import { QUERY_KEYS } from '../constant/queryKeys.constant';
import { IRoleListResponse } from '../@types/user/role.interface';

export const getAllRole = () => axiosInstance.get<unknown, IRoleListResponse>(API_ROLE);

export const useGetAllRole = () => useQuery([QUERY_KEYS.LIST_ROLE], () => getAllRole());
