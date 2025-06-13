import { useQuery } from 'react-query';
import { fetchDepartments } from '../department.service'; // Dịch vụ lấy danh sách phòng ban
import { QUERY_KEYS } from 'src/common/constant/queryKeys.constant';
import { IParamsDepartment } from '../department.interface'; // Interface của phòng ban

const useGetListDepartment = (params: IParamsDepartment) =>
  useQuery([QUERY_KEYS.LIST_DEPARTMENT, params], () => fetchDepartments(params));

export default useGetListDepartment;
