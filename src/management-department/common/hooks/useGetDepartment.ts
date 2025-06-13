import { useQuery } from 'react-query';
import { fetchDepartmentById } from '../department.service';
import { IDepartmentResponse } from 'src/common/@types/department/department.interface';

const useGetDepartment = (departmentId: string) =>
  useQuery<IDepartmentResponse>(['department', departmentId], () => fetchDepartmentById(departmentId), {
    enabled: !!departmentId,  // Chỉ gọi khi departmentId có giá trị
  });

export default useGetDepartment;
