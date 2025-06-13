import { useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Card, Stack, Typography, Box, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  RHFTextField,
  FormProvider,
  RHFEditor,
  RHFUploadMultiFile,
} from 'src/common/components/hook-form';
import { IEquipmentDetailBySerial } from 'src/common/@types/equipment/equipment.interface';
import { styled } from '@mui/material/styles';
import { default as useMessage } from 'src/common/hooks/useMessage';
import Label from 'src/common/components/Label';
import useUploadMultiImage from 'src/common/hooks/useUploadMultiImage';
import axiosInstance from 'src/common/utils/axios';
import { API_UPLOAD_MULTIPLE_IMAGE } from 'src/common/constant/api.constant';
import SerialImageGallery from './SerialImageGallery';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

type LabelColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default';

type Props = {
  serialEquipment: IEquipmentDetailBySerial;
  isEdit?: boolean;
  onSubmit?: (data: any) => Promise<void> | void;
  isSubmitting?: boolean;
};

type FormValues = {
  serialNumber: string;
  description: string;
  location: string;
  status: string;
  dayOfFirstUse: string;
  roomName: string;
  departmentName: string;
  groupEquipmentName: string;
  importReceiptNote: string;
  images: (File & { preview?: string })[];
};

export default function SerialEquipmentInfo({
  serialEquipment,
  isEdit = true,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const { showErrorSnackbar, showSuccessSnackbar } = useMessage();
  const defaultValues = useMemo<FormValues>(
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
      images: [],
    }),
    [serialEquipment]
  );

  const methods = useForm<FormValues>({
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isDirty },
    setValue,
    watch,
  } = methods;

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line
  }, [serialEquipment]);

  const {
    uploadImages: uploadMultiImages,
    progress: uploadProgress,
    error: uploadError,
  } = useUploadMultiImage();

  // Handlers for multi image upload
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Only add to component state, do not upload yet
      const images = watch('images') || [];
      setValue('images', [
        ...images,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
    [setValue, watch]
  );

  const handleUpload = async () => {
    const images = watch('images') || [];
    const filesToUpload = images.filter((img: any) => !img.url);
    if (!filesToUpload.length) return;
    try {
      // Upload to Firebase first
      const urls = await uploadMultiImages(filesToUpload, {
        serialNumber: defaultValues.serialNumber,
        customString: 'owner-image',
      });
      // Merge uploaded urls into images array
      const newImages = images.map((img: any) => {
        if (!img.url) {
          const url = urls.shift();
          return { ...img, url, preview: url };
        }
        return img;
      });
      setValue('images', newImages);

      // Prepare payload for BE API
      const payload = {
        images: newImages
          .filter((img: any) => img.url)
          .map((img: any) => ({
            actionType: 'owner',
            actionId: null,
            serialNumber: defaultValues.serialNumber,
            imageUrl: img.url,
            note: '', // You can add note if needed
          })),
      };

      await axiosInstance.post(API_UPLOAD_MULTIPLE_IMAGE, payload);

      showSuccessSnackbar('Tải ảnh lên thành công!');
    } catch (err: any) {
      showErrorSnackbar(err?.message || 'Tải ảnh lên thất bại!');
    }
  };

  console.log(watch('images'));

  const handleRemoveAll = () => {
    setValue('images', []);
  };

  const handleRemove = (file: File | string) => {
    const images = watch('images') || [];
    const filteredItems = images.filter((_file) =>
      typeof _file === 'string' ? _file !== file : (_file as File).name !== (file as File).name
    );
    setValue('images', filteredItems);
  };

  // Prepare initial images from BE response
  const initialImages =
    serialEquipment.images && Array.isArray(serialEquipment.images)
      ? serialEquipment.images.map((img: any) => ({
          url: img.imageUrl,
          preview: img.imageUrl,
          id: img.id,
          note: img.note,
        }))
      : [];

  // Map status to color and label
  const getStatusProps = (status: string): { color: LabelColor; label: string } => {
    switch (status) {
      case 'available':
        return { color: 'success', label: 'Sẵn sàng' };
      case 'in_use':
        return { color: 'info', label: 'Đang sử dụng' };
      case 'under_maintenance':
        return { color: 'warning', label: 'Bảo trì' };
      case 'out_of_service':
        return { color: 'error', label: 'Ngừng hoạt động' };
      case 'liquidation':
        return { color: 'default', label: 'Thanh lý' };
      case 'reserved':
        return { color: 'primary', label: 'Đã đặt trước' };
      case 'pending_transfer':
        return { color: 'secondary', label: 'Chờ chuyển giao' };
      default:
        return { color: 'default', label: status };
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit || (() => {}))}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Card sx={{ p: 3, mb: 3 }}>
              <Stack
                direction={'row'}
                alignContent={'center'}
                justifyContent={'space-between'}
                mb={3}
              >
                <LabelStyle>Thông tin thiết bị</LabelStyle>
                <Box>
                  <Box sx={{ textTransform: 'capitalize', mb: 1, display: 'inline-block' }}>
                    <Label color={getStatusProps(defaultValues.status).color}>
                      {getStatusProps(defaultValues.status).label}
                    </Label>
                  </Box>
                </Box>
              </Stack>
              <Stack spacing={2}>
                <RHFTextField name="serialNumber" label="Số serial" disabled fullWidth />
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

                <Stack mb={3}>
                  <LabelStyle>Vị trí hiện tại</LabelStyle>
                </Stack>
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
              </Stack>
            </Card>
            <Card sx={{ p: 3 }}>
              <div>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Hình ảnh hiện tại
                </Typography>
                <SerialImageGallery images={initialImages} />
              </div>
            </Card>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <div>
                <LabelStyle>Mô tả</LabelStyle>
                <RHFEditor simple name="description" />
              </div>
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
            <Card sx={{ p: 3 }}>
              <div>
                <LabelStyle>Hình ảnh</LabelStyle>
                <RHFUploadMultiFile
                  showPreview
                  name="images"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                  onUpload={handleUpload}
                />
                {/* Show upload progress and error */}
                {isEdit && (
                  <>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <Typography sx={{ mt: 1 }} color="primary">
                        Đang tải lên: {Math.round(uploadProgress)}%
                      </Typography>
                    )}
                    {uploadError && (
                      <Typography sx={{ mt: 1 }} color="error">
                        {uploadError}
                      </Typography>
                    )}
                  </>
                )}
              </div>
            </Card>
          </Stack>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, mt: 3 }}>
          <LabelStyle>Thông tin phiếu nhập</LabelStyle>
          <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
            {/* Supplier info */}
            {serialEquipment.importReceipt?.supplier && (
              <Box>
                <LabelStyle>Nhà cung cấp</LabelStyle>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {serialEquipment.importReceipt.supplier.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {serialEquipment.importReceipt.supplier.address}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {serialEquipment.importReceipt.supplier.phone}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {serialEquipment.importReceipt.supplier.email}
                </Typography>
              </Box>
            )}
            <Stack spacing={2}>
              {/* Price import */}
              {serialEquipment.importReceipt?.price && (
                <RHFTextField
                  name="price"
                  label="Giá nhập"
                  value={Number(serialEquipment.importReceipt.price).toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                  disabled
                  fullWidth
                />
              )}
              <Stack
                direction={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
                spacing={2}
              >
                {/* Approve user */}
                {serialEquipment.importReceipt?.approvedBy && (
                  <RHFTextField
                    name="approvedBy"
                    label="Người duyệt"
                    value={
                      serialEquipment.importReceipt.approvedBy.username ||
                      serialEquipment.importReceipt.approvedBy.userCode
                    }
                    disabled
                    fullWidth
                  />
                )}
                {/* Requested user */}
                {serialEquipment.importReceipt?.userRequested && (
                  <RHFTextField
                    name="userRequested"
                    label="Người yêu cầu"
                    value={
                      serialEquipment.importReceipt.userRequested.username ||
                      serialEquipment.importReceipt.userRequested.userCode
                    }
                    disabled
                    fullWidth
                  />
                )}
              </Stack>
              {/* Date of received */}
              {serialEquipment.importReceipt?.receivedAt && (
                <RHFTextField
                  name="receivedAt"
                  label="Ngày nhận"
                  value={
                    serialEquipment.importReceipt.receivedAt
                      ? new Date(serialEquipment.importReceipt.receivedAt).toLocaleDateString(
                          'vi-VN'
                        )
                      : ''
                  }
                  disabled
                  fullWidth
                />
              )}
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </FormProvider>
  );
}
