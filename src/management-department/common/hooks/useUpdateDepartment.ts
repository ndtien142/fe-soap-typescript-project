import { useMutation } from 'react-query';
import { ICallbackMutation } from 'src/common/@types/common.interface';
import { IUpdateDepartmentData } from '../department.interface';
import { updateDepartment } from '../department.service'; 

// Định nghĩa hàm mutationFn
const useUpdateDepartment = (callback: ICallbackMutation) =>
  useMutation(
    (variables: { departmentId: string; data: IUpdateDepartmentData }) =>
      updateDepartment(variables.departmentId, variables.data), 
    {
      onSuccess: () => {
        callback.onSuccess(); 
      },
      onError: (error) => {
        callback.onError();
        console.error(error);
      },
    }
  );

export default useUpdateDepartment;
