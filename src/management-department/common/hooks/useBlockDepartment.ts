import { useMutation } from 'react-query';
import { markDepartmentAsInactive } from '../department.service'; // Dịch vụ đánh dấu phòng ban không hoạt động
import { ICallbackMutation } from 'src/common/@types/common.interface';

export const useBlockDepartment = (callback: ICallbackMutation) =>
  useMutation(markDepartmentAsInactive, {
    onSuccess: () => {
      callback.onSuccess(); // Gọi hàm callback khi thành công
    },
    onError: (error) => {
      callback.onError(); // Gọi hàm callback khi có lỗi
      console.error(error);
    },
  });
