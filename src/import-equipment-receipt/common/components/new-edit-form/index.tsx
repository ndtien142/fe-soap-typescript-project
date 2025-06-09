import * as Yup from 'yup';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
// components
import ImportNewEditDetails from './ImportNewEditDetails';
import ImportNewEditAddress from './ImportNewEditAddress';
import ImportNewEditStatusDate from './ImportNewEditStatusDate';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import { FormProvider } from 'src/common/components/hook-form';
// @types
import { IImportReceipt } from 'src/common/@types/import-receipt/import-receipt.interface';
import axiosInstance from 'src/common/utils/axios';
import { API_IMPORT_RECEIPT } from 'src/common/constant/api.constant';

// ----------------------------------------------------------------------

type Props = {
  isEdit?: boolean;
  currentImportReceipt?: IImportReceipt;
};

export default function ImportReceiptNewEditForm({ isEdit, currentImportReceipt }: Props) {
  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const ImportReceiptSchema = Yup.object().shape({
    name: Yup.string().required('Tên phiếu nhập là bắt buộc'),
    status: Yup.string().required('Trạng thái là bắt buộc'),
    dateOfOrder: Yup.string().nullable().required('Ngày đặt hàng là bắt buộc'),
    dateOfReceived: Yup.string().nullable().required('Ngày nhận hàng dự kiến là bắt buộc'),
    supplier: Yup.object().required('Nhà cung cấp là bắt buộc'),
    items: Yup.array()
      .of(
        Yup.object().shape({
          code: Yup.string().required('Mã thiết bị là bắt buộc'),
          name: Yup.string().required('Tên thiết bị là bắt buộc'),
          quantity: Yup.number().required('Số lượng là bắt buộc').min(1, 'Tối thiểu 1'),
          price: Yup.number().required('Đơn giá là bắt buộc').min(0, 'Không âm'),
        })
      )
      .min(1, 'Vui lòng nhập ít nhất 1 thiết bị')
      .required('Vui lòng nhập ít nhất 1 thiết bị'),
    discount: Yup.number().min(0, 'Không âm').default(0),
    taxes: Yup.number().min(0, 'Không âm').default(0),
    note: Yup.string(),
    dateOfActualReceived: Yup.string().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentImportReceipt?.name || '',
      // Only allow 'requested' status when creating
      status: isEdit ? currentImportReceipt?.status || 'requested' : 'requested',
      dateOfOrder: currentImportReceipt?.dateOfOrder || '',
      dateOfReceived: currentImportReceipt?.dateOfReceived || '',
      dateOfActualReceived: currentImportReceipt?.dateOfActualReceived || '',
      supplier: currentImportReceipt?.supplier || null,
      items: currentImportReceipt?.items || [{ code: '', name: '', quantity: 1, price: 0 }],
      discount: 0,
      taxes: 0,
      note: currentImportReceipt?.note || '',
    }),
    [currentImportReceipt, isEdit]
  );

  const methods = useForm({
    resolver: yupResolver(ImportReceiptSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // Determine if all fields should be disabled (status is received, approved, or rejected)
  const allDisabled = ['received', 'approved', 'rejected'].includes(values.status);

  useEffect(() => {
    if (isEdit && currentImportReceipt) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentImportReceipt]);

  const handleSaveAsDraft = async (data: any) => {
    setLoadingSave(true);

    try {
      // POST to API
      await axiosInstance.post(API_IMPORT_RECEIPT, {
        ...data,
        status: 'requested',
      });
      reset();
      setLoadingSave(false);
      navigate(PATH_DASHBOARD.importReceipt.list);
      // console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      setLoadingSave(false);
      console.error(error);
    }
  };

  const handleCreateAndSend = async (data: any) => {
    setLoadingSend(true);

    try {
      // POST to API
      await axiosInstance.post(API_IMPORT_RECEIPT, data);
      reset();
      setLoadingSend(false);
      navigate(PATH_DASHBOARD.importReceipt.list);
      // console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      setLoadingSend(false);
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        <ImportNewEditAddress />

        <ImportNewEditStatusDate
          statusOptions={
            isEdit
              ? ['requested', 'approved', 'processing', 'received', 'returned', 'rejected']
              : ['requested']
          }
          isEdit={isEdit}
        />

        <ImportNewEditDetails />
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
}
