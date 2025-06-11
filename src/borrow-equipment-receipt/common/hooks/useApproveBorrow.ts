import { useState } from 'react';
import { API_BORROW_RECEIPT } from 'src/common/constant/api.constant';
import axiosInstance from 'src/common/utils/axios';

interface IApproveBorrowOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export const useApproveBorrow = ({
  onSuccess = () => {},
  onError = () => {},
}: IApproveBorrowOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);

  const approveOrReject = async (
    id: string | number,
    action: 'approve' | 'reject',
    reason: string
  ) => {
    setIsLoading(true);
    try {
      await axiosInstance.put(`${API_BORROW_RECEIPT}/${id}/action`, {
        action,
        reason,
      });
      onSuccess();
    } catch (error) {
      console.error('Error approving or rejecting borrow receipt:', error);
      const message = error?.response?.data;
      onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, approveOrReject };
};
