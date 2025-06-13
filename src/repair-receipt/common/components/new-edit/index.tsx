import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { FormProvider } from 'src/common/components/hook-form';
import RepairReceiptStatusDate from './RepairNewEditStatusDate';
import RepairReceiptDetails from './RepairNewEditDetails';


export interface IRepairReceipt {
  title: string;
  startDate: string;
  endDate: string;
  reason: string;
  responsiblePerson: string;
  status: 'pending' | 'repairing' | 'completed';
  image?: File | null;
  items: { serialNumber: string; note?: string }[];
}

type Props = {
  isEdit?: boolean;
  currentReceipt?: Partial<IRepairReceipt>;
};

const RepairReceiptNewEditForm = ({ isEdit = false, currentReceipt }: Props) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

  const RepairReceiptSchema = Yup.object().shape({
    title: Yup.string().required('Tên phiếu là bắt buộc'),
    startDate: Yup.string().required('Ngày bắt đầu là bắt buộc'),
    endDate: Yup.string().required('Ngày kết thúc là bắt buộc'),
    reason: Yup.string().required('Lý do là bắt buộc'),
    responsiblePerson: Yup.string().required('Người chịu trách nhiệm là bắt buộc'),
    status: Yup.string().required('Trạng thái là bắt buộc'),
    image: Yup.mixed().nullable(),
    items: Yup.array()
      .of(
        Yup.object().shape({
          serialNumber: Yup.string().required('Số serial là bắt buộc'),
          note: Yup.string(),
        })
      )
      .min(1, 'Vui lòng thêm ít nhất 1 thiết bị'),
  });

  const defaultValues = useMemo<IRepairReceipt>(
    () => ({
      title: currentReceipt?.title || '',
      startDate: currentReceipt?.startDate || '',
      endDate: currentReceipt?.endDate || '',
      reason: currentReceipt?.reason || '',
      responsiblePerson: currentReceipt?.responsiblePerson || '',
      status: currentReceipt?.status || 'pending',
      image: currentReceipt?.image || null,
      items: currentReceipt?.items || [{ serialNumber: '', note: '' }],
    }),
    [currentReceipt]
  );

  const methods = useForm<IRepairReceipt>({
    resolver: yupResolver(RepairReceiptSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [isEdit, currentReceipt]);

  const handleSaveDraft = async (data: IRepairReceipt) => {
    setLoadingSave(true);
    try {
      // await axios.post(API_REPAIR_RECEIPT, { ...data, status: 'pending' });
      reset();
    } finally {
      setLoadingSave(false);
    }
  };

  const handleCreateAndSend = async (data: IRepairReceipt) => {
    setLoadingSend(true);
    try {
      // await axios.post(API_REPAIR_RECEIPT, data);
      reset();
    } finally {
      setLoadingSend(false);
    }
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        <RepairReceiptStatusDate />
        <RepairReceiptDetails />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          color="inherit"
          size="large"
          variant="contained"
          loading={loadingSave && isSubmitting}
          onClick={handleSubmit(handleSaveDraft)}
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
    </FormProvider>
  );
};

export default RepairReceiptNewEditForm;
