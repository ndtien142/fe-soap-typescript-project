import { useMutation } from 'react-query';
import { ICallbackMutation } from 'src/common/@types/common.interface';
import { IUpdateDepartmentData } from '../department.interface';
import { updateDepartment } from '../department.service'; // Giả sử bạn có dịch vụ updateDepartment

// Định nghĩa hàm mutationFn
const useUpdateDepartment = (callback: ICallbackMutation) =>
  useMutation(
    (variables: { departmentId: string; data: IUpdateDepartmentData }) =>
      updateDepartment(variables.departmentId, variables.data), // Chuyển các tham số thành đối tượng
    {
      onSuccess: () => {
        callback.onSuccess(); // Gọi hàm callback khi thành công
      },
      onError: (error) => {
        callback.onError(); // Gọi hàm callback khi có lỗi
        console.error(error);
      },
    }
  );

export default useUpdateDepartment;
