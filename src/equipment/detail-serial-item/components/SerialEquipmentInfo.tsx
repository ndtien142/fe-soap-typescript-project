import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Card, Stack, Typography, MenuItem, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  RHFTextField,
  RHFSelect,
  FormProvider,
  RHFUploadAvatar,
} from 'src/common/components/hook-form';
import { IEquipmentDetailBySerial } from 'src/common/@types/equipment/equipment.interface';

type Props = {
  serialEquipment: IEquipmentDetailBySerial;
  isEdit?: boolean;
  onSubmit?: (data: any) => Promise<void> | void;
  isSubmitting?: boolean;
};

export default function SerialEquipmentInfo({
  serialEquipment,
  isEdit = true,
  onSubmit,
  isSubmitting = false,
}: Props) {
  // You can add image field/component here later if needed

  const defaultValues = useMemo(
    () => ({
      serialNumber: serialEquipment.serialNumber || '',
      description: serialEquipment.description || '',
      location: serialEquipment.location || '',
      status: serialEquipment.status || '',
      dayOfFirstUse: serialEquipment.dayOfFirstUse || '',
      roomName: serialEquipment.room?.name || '',
      departmentName: serialEquipment.room?.department?.name || '',
      groupEquipmentName: serialEquipment.groupEquipment?.name || '',
      importReceiptNote: serialEquipment.importReceipt?.note || '',
      image: serialEquipment.image || null, // Add image field
    }),
    [serialEquipment]
  );

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isDirty },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line
  }, [serialEquipment]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit || (() => {}))}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Thông tin chi tiết thiết bị theo số serial
        </Typography>
        <Stack spacing={2}>
          <RHFUploadAvatar
            name="image"
            disabled={!isEdit}
            helperText={
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  mx: 'auto',
                  display: 'block',
                  textAlign: 'center',
                  color: 'text.secondary',
                }}
              >
                Allowed *.jpeg, *.jpg, *.png, *.gif
              </Typography>
            }
          />
          <RHFTextField name="serialNumber" label="Số serial" disabled fullWidth />
          <RHFTextField name="description" label="Mô tả" disabled={!isEdit} fullWidth />
          <RHFTextField name="location" label="Vị trí" disabled={!isEdit} fullWidth />
          <RHFSelect name="status" label="Trạng thái" disabled={!isEdit} fullWidth>
            <MenuItem value="in_use">Đang sử dụng</MenuItem>
            <MenuItem value="available">Sẵn sàng</MenuItem>
          </RHFSelect>
          <RHFTextField
            name="dayOfFirstUse"
            label="Ngày sử dụng đầu tiên"
            disabled
            fullWidth
            value={
              defaultValues.dayOfFirstUse
                ? new Date(defaultValues.dayOfFirstUse).toLocaleDateString('vi-VN')
                : ''
            }
          />
          <RHFTextField
            name="roomName"
            label="Phòng"
            disabled
            fullWidth
            value={defaultValues.roomName}
          />
          <RHFTextField
            name="departmentName"
            label="Khoa"
            disabled
            fullWidth
            value={defaultValues.departmentName}
          />
          <RHFTextField
            name="groupEquipmentName"
            label="Nhóm thiết bị"
            disabled
            fullWidth
            value={defaultValues.groupEquipmentName}
          />
          <RHFTextField
            name="importReceiptNote"
            label="Ghi chú phiếu nhập"
            disabled
            fullWidth
            value={defaultValues.importReceiptNote}
          />
        </Stack>
        {isEdit && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={!isDirty}
            >
              Lưu thay đổi
            </LoadingButton>
          </Box>
        )}
      </Card>
    </FormProvider>
  );
}
