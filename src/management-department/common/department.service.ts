import axiosInstance from 'src/common/utils/axios';
import { ICreateDepartmentData, IParamsDepartment, IUpdateDepartmentData } from './department.interface';
import { API_DEPARTMENT } from 'src/common/constant/api.constant';
import { IListDepartmentResponse, IDepartmentResponse } from 'src/common/@types/department/department.interface';

// Lấy danh sách phòng ban
export const fetchDepartments = async (params: IParamsDepartment) => {
  const response = await axiosInstance.get<unknown, IListDepartmentResponse>(API_DEPARTMENT, { params });
  return response;
};

// Lấy chi tiết phòng ban theo ID
export const fetchDepartmentById = async (departmentId: string) => {
  const response = await axiosInstance.get<unknown, IDepartmentResponse>(`${API_DEPARTMENT}/${departmentId}`);
  return response;
};

// Tạo phòng ban mới
export const createDepartment = async (data: ICreateDepartmentData) => {
  const response = await axiosInstance.post<unknown, IDepartmentResponse>(API_DEPARTMENT, data);
  return response;
};

// Cập nhật thông tin phòng ban
export const updateDepartment = async (departmentId: string, data: IUpdateDepartmentData) => {
  const response = await axiosInstance.put<unknown, IDepartmentResponse>(
    `${API_DEPARTMENT}/${departmentId}`,
    data
  );
  return response;
};

// Đánh dấu phòng ban là không hoạt động (Inactive)
export const markDepartmentAsInactive = async ({
  departmentId,
  isActive,
}: {
  departmentId: string;
  isActive: boolean;
}) => {
  const response = await axiosInstance.patch<unknown, IDepartmentResponse>(
    `${API_DEPARTMENT}/${departmentId}/deactivate`,
    { isActive }
  );
  return response;
};

// Xóa phòng ban
export const markDepartmentAsDeleted = async (departmentId: string) => {
  const response = await axiosInstance.patch<unknown, IDepartmentResponse>(
    `${API_DEPARTMENT}/${departmentId}/delete`
  );
  return response;
};
