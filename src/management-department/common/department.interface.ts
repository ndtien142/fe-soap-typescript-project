export interface ICreateDepartmentData {
  name: string;
  description: string;
  managerId: string; // Có thể là ID của người quản lý phòng ban
  location?: string;
}

export interface IUpdateDepartmentData {
  departmentCode: string; // Mã phòng ban
  name: string;
  description: string;
  managerId: string; // ID của người quản lý phòng ban
  isActive: boolean; // Trạng thái hoạt động của phòng ban
  location?: string;
}

export interface IParamsDepartment {
  page: number;
  limit: number;
  search?: string; // Tìm kiếm theo tên hoặc mô tả
  isActive?: boolean; // Trạng thái hoạt động
}
