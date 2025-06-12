import { useMutation } from 'react-query';
import { ICallbackMutation } from 'src/common/@types/common.interface';
import { markDepartmentAsDeleted } from '../department.service'; // Dịch vụ đánh dấu phòng ban đã xóa

const useMarkDepartmentAsDeleted = (callback: ICallbackMutation) =>
  useMutation(markDepartmentAsDeleted, {
    onSuccess: () => {
      callback.onSuccess(); // Gọi hàm callback khi thành công
    },
    onError: (error) => {
      callback.onError(); // Gọi hàm callback khi có lỗi
      console.error(error);
    },
  });

export default useMarkDepartmentAsDeleted;
