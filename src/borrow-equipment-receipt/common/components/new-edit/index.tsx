import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import BorrowNewEditRoom from './BorrowNewEditRoom';
import BorrowNewEditStatusDate from './BorrowNewEditStatusDate';
import BorrowNewEditDetails from './BorrowNewEditDetails';
import { IBorrowReceiptRequest } from '../../../../common/@types/borrow-receipt/borrowReceipt.interface';
import { FormProvider } from '../../../../common/components/hook-form';
// ----------------------------------------------------------------------

type Props = {
  isEdit?: boolean;
  currentBorrowReceipt?: Partial<IBorrowReceiptRequest>;
};

const BorrowReceiptNewEditForm = ({ isEdit, currentBorrowReceipt }: Props) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

  const BorrowReceiptSchema = Yup.object().shape({
    borrowDate: Yup.string().required('Ngày mượn là bắt buộc'),
    returnDate: Yup.string().required('Ngày trả là bắt buộc'),
    note: Yup.string(),
    roomId: Yup.string().required('Phòng là bắt buộc'),
    type: Yup.string().oneOf(['specific', 'random']).required(),
    groups: Yup.array()
      .of(
        Yup.object().shape({
          groupEquipmentCode: Yup.string().required('Nhóm thiết bị là bắt buộc'),
          quantity: Yup.number().min(1, 'Tối thiểu 1').required('Số lượng là bắt buộc'),
        })
      )
      .min(1, 'Vui lòng nhập ít nhất 1 nhóm thiết bị')
      .required('Vui lòng nhập ít nhất 1 nhóm thiết bị'),
  });

  const defaultValues = useMemo(
    () => ({
      borrowDate: currentBorrowReceipt?.borrowDate || '',
      returnDate: currentBorrowReceipt?.returnDate || '',
      note: currentBorrowReceipt?.note || '',
      roomId: currentBorrowReceipt?.roomId || '',
      type: currentBorrowReceipt?.type || 'specific',
      groups: currentBorrowReceipt?.groups || [{ groupEquipmentCode: '', quantity: 1 }],
    }),
    [currentBorrowReceipt]
  );

  const methods = useForm<IBorrowReceiptRequest>({
    resolver: yupResolver(BorrowReceiptSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentBorrowReceipt) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line
  }, [isEdit, currentBorrowReceipt]);

  const allDisabled = false; // Add logic if needed

  const handleSaveAsDraft = async (data: IBorrowReceiptRequest) => {
    setLoadingSave(true);
    try {
      // await axiosInstance.post(API_BORROW_RECEIPT, { ...data, status: 'requested' });
      reset();
      setLoadingSave(false);
      // navigate(PATH_DASHBOARD.borrowReceipt.list);
    } catch (error) {
      setLoadingSave(false);
      // handle error
    }
  };

  const handleCreateAndSend = async (data: IBorrowReceiptRequest) => {
    setLoadingSend(true);
    try {
      // await axiosInstance.post(API_BORROW_RECEIPT, data);
      reset();
      setLoadingSend(false);
      // navigate(PATH_DASHBOARD.borrowReceipt.list);
    } catch (error) {
      setLoadingSend(false);
      // handle error
    }
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        <BorrowNewEditRoom />
        <BorrowNewEditStatusDate />
        <BorrowNewEditDetails />
      </Card>
      {!allDisabled && (
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
          <LoadingButton
            color="inherit"
            size="large"
            variant="contained"
            loading={loadingSave && isSubmitting}
            onClick={handleSubmit(handleSaveAsDraft)}
          >
            Lưu nháp
          </LoadingButton>
          <LoadingButton
            size="large"
            variant="contained"
            loading={loadingSend && isSubmitting}
            onClick={handleSubmit(handleCreateAndSend)}
          >
            {isEdit ? 'Cập nhật & Gửi' : 'Tạo & Gửi'}
          </LoadingButton>
        </Stack>
      )}
    </FormProvider>
  );
};

export default BorrowReceiptNewEditForm;
