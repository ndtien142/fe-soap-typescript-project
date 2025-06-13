import * as Yup from 'yup';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
import { default as useMessage } from 'src/common/hooks/useMessage';
// routes
import { PATH_DASHBOARD } from 'src/common/routes/paths';
// components
import { FormProvider } from 'src/common/components/hook-form';
import TransferNewEditRoom from './TransferNewEditRoom';
import TransferNewEditStatusDate from './TransferNewEditStatusDate';
import TransferNewEditDetails from './TransferNewEditDetails';
import { useGetListRoom } from 'src/borrow-equipment-receipt/common/hooks/useGetListRoom';
import { dispatch } from 'src/common/redux/store';
import { setRoomOptionsFrom, setRoomOptionsTo } from '../../store/transferEditNew.slice';
import { IRoom } from 'src/common/@types/department/department.interface';
import { TransferCreateSchema } from '../../transfer.schema';
import axiosInstance from 'src/common/utils/axios';
import { API_TRANSFER_RECEIPT } from 'src/common/constant/api.constant';
// ----------------------------------------------------------------------

type IEquipment = {
  serialNumber: string;
  name: string;
  type: { id: number; name: string };
  description: string;
  status: string;
  images: string[];
};

type TransferItem = {
  serialNumber: string;
  notes: string;
};

type FormValuesProps = {
  transferDate: Date | null;
  userCode: string;
  notes: string;
  roomFrom: IRoom | null;
  roomTo: IRoom | null;
  items: TransferItem[];
  equipmentList?: IEquipment[];
};

// Add this type for the request body
export type TransferCreateRequest = {
  transferDate: string;
  transferFrom: string;
  transferTo: string;
  userCode: string;
  notes: string;
  items: {
    serialNumber: string;
    notes: string;
  }[];
};

type Props = {
  isEdit?: boolean;
  currentTransfer?: FormValuesProps;
};

export default function TransferNewEditForm({ isEdit, currentTransfer }: Props) {
  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

  const { showErrorSnackbar, showSuccessSnackbar } = useMessage();

  // Fetch room list using hook
  const { data: fetchedRooms, fetchData: fetchRooms } = useGetListRoom({
    onSuccess: () => {},
    onError: () => {},
  });

  useEffect(() => {
    fetchRooms({ page: 1, limit: 20 });
  }, []);

  useEffect(() => {
    if (fetchedRooms) {
      dispatch(setRoomOptionsFrom(fetchedRooms));
      dispatch(setRoomOptionsTo(fetchedRooms));
    }
  }, [fetchedRooms]);

  const defaultValues = useMemo(
    () => ({
      transferDate: currentTransfer?.transferDate || new Date(),
      userCode: currentTransfer?.userCode || '',
      notes: currentTransfer?.notes || '',
      roomFrom: currentTransfer?.roomFrom || null,
      roomTo: currentTransfer?.roomTo || null,
      items: currentTransfer?.items || [],
    }),
    [currentTransfer]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(TransferCreateSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  console.log('values', values);

  console.log('errors', errors);

  useEffect(() => {
    if (isEdit && currentTransfer) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentTransfer]);

  function mapFormValuesToRequest(values: FormValuesProps): TransferCreateRequest {
    return {
      transferDate: values.transferDate
        ? typeof values.transferDate === 'string'
          ? values.transferDate
          : values.transferDate.toISOString().split('T')[0]
        : '',
      transferFrom: values.roomFrom?.id || '',
      transferTo: values.roomTo?.id || '',
      userCode: values.userCode,
      notes: values.notes,
      items: (values.items || []).map((item) => ({
        serialNumber: item.serialNumber,
        notes: item.notes,
      })),
    };
  }

  // const handleSaveAsDraft = async (data: FormValuesProps) => {
  //   setLoadingSave(true);
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 500));
  //     reset();
  //     navigate(PATH_DASHBOARD.transferReceipt.list);
  //     setLoadingSave(false);
  //     console.log('Save as draft:', JSON.stringify(mapFormValuesToRequest(data), null, 2));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleCreateAndSend = async (data: FormValuesProps) => {
    setLoadingSend(true);
    try {
      const dataSend = mapFormValuesToRequest(data);
      // await new Promise((resolve) => setTimeout(resolve, 500));
      await axiosInstance.post(API_TRANSFER_RECEIPT, dataSend);
      reset();
      console.log('Create & Send:', JSON.stringify(dataSend, null, 2));
      setLoadingSend(false);
      showSuccessSnackbar('Tạo phiếu chuyển thiết bị thành công!');
      navigate(PATH_DASHBOARD.transferReceipt.list);
    } catch (error) {
      console.error(error);
      showErrorSnackbar('Tạo phiếu chuyển thiết bị thất bại!');
    }
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        <TransferNewEditRoom />
        <TransferNewEditStatusDate />
        <TransferNewEditDetails />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        {/* <LoadingButton
          color="inherit"
          size="large"
          variant="contained"
          loading={loadingSave && isSubmitting}
          onClick={handleSubmit(handleSaveAsDraft)}
        >
          Lưu nháp
        </LoadingButton> */}

        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend && isSubmitting}
          onClick={handleSubmit(handleCreateAndSend)}
        >
          {isEdit ? 'Cập nhật' : 'Tạo mới'} & Gửi
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
