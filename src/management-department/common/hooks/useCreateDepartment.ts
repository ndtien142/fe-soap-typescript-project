import { useMutation } from 'react-query';
import { ICallbackMutation } from 'src/common/@types/common.interface';
import { createDepartment } from '../department.service'; // Dịch vụ tạo phòng ban

const useCreateDepartment = (callback: ICallbackMutation) =>
  useMutation(createDepartment, {
    onSuccess: () => {
      callback.onSuccess(); // Gọi hàm callback khi thành công
    },
    onError: (error) => {
      callback.onError(); // Gọi hàm callback khi có lỗi
    },
  });

export default useCreateDepartment;
