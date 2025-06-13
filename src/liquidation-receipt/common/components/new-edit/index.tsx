import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { FormProvider } from 'src/common/components/hook-form';
import { ILiquidationReceipt } from 'src/common/@types/liquidation-receipt/liquidationReceipt.interface';
import LiquidationNewEditDetails from './LiquidationNewEditDetails';
import LiquidationNewEditStatusDate from './LiquidationNewEditStatusDate';


type Props = {
  isEdit?: boolean;
  currentReceipt?: Partial<ILiquidationReceipt>;
};

const LiquidationReceiptNewEditForm = ({ isEdit, currentReceipt }: Props) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

  const LiquidationSchema = Yup.object().shape({
    liquidationDate: Yup.string().required('Ngày thanh lý là bắt buộc'),
    note: Yup.string(),
    items: Yup.array()
      .of(
        Yup.object().shape({
          serialNumber: Yup.string().required('Số serial là bắt buộc'),
          note: Yup.string(),
        })
      )
      .min(1, 'Vui lòng thêm ít nhất 1 thiết bị'),
  });

  const defaultValues = useMemo(
    () => ({
      liquidationDate: currentReceipt?.liquidationDate || '',
      note: currentReceipt?.note || '',
      items: currentReceipt?.items || [{ serialNumber: '', note: '' }],
    }),
    [currentReceipt]
  );

  const methods = useForm<ILiquidationReceipt>({
    resolver: yupResolver(LiquidationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentReceipt) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentReceipt]);

  const handleSaveDraft = async (data: ILiquidationReceipt) => {
    setLoadingSave(true);
    try {
      // await axios.post(API_LIQUIDATION_RECEIPT, { ...data, status: 'processing' });
      reset();
    } finally {
      setLoadingSave(false);
    }
  };

  const handleCreateAndSend = async (data: ILiquidationReceipt) => {
    setLoadingSend(true);
    try {
      // await axios.post(API_LIQUIDATION_RECEIPT, data);
      reset();
    } finally {
      setLoadingSend(false);
    }
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        <LiquidationNewEditStatusDate />
        <LiquidationNewEditDetails />
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

export default LiquidationReceiptNewEditForm;
