import { useState } from 'react';
import { Box, Card, Typography, Stack, Button, CircularProgress } from '@mui/material';
import { RHFUploadMultiFile, FormProvider } from 'src/common/components/hook-form';
import { useForm } from 'react-hook-form';
import useUploadMultiImage from 'src/common/hooks/useUploadMultiImage';
import axiosInstance from 'src/common/utils/axios';
import { API_BORROW_RECEIPT } from 'src/common/constant/api.constant';
import { useParams } from 'react-router-dom';
import { default as useMessage } from 'src/common/hooks/useMessage';
import { useDispatch } from 'src/common/redux/store';
import { onBackStep } from 'src/borrow-equipment-receipt/scan/scan.slice';

type FormValues = {
  confirmFiles: File[];
};

type Props = {
  onSuccess?: () => void;
};

export default function UploadConfirmAndSuccessBorrow({ onSuccess }: Props) {
  const { id } = useParams<{ id: string }>();
  const { showSuccessSnackbar, showErrorSnackbar } = useMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const methods = useForm<FormValues>({
    defaultValues: { confirmFiles: [] },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = methods;

  const { uploadImages, progress, error } = useUploadMultiImage();

  const onSubmit = async (data: FormValues) => {
    if (!data.confirmFiles || data.confirmFiles.length === 0) {
      showErrorSnackbar('Vui lòng chọn file xác nhận!');
      return;
    }
    setIsSubmitting(true);
    try {
      // Upload files to Firebase
      const urls = await uploadImages(data.confirmFiles);
      // Call API to confirm borrow receipt with all file URLs
      await axiosInstance.post(`${API_BORROW_RECEIPT}/${id}/confirm`, {
        confirmFileUrls: urls,
      });
      showSuccessSnackbar('Xác nhận và hoàn tất phiếu mượn thành công!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      showErrorSnackbar(err?.message || 'Xác nhận thất bại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  function handleDrop<T extends File>(acceptedFiles: T[]) {
    const currentFiles = watch('confirmFiles') || [];
    setValue('confirmFiles', [...currentFiles, ...acceptedFiles], { shouldDirty: true });
  }
  function handleRemove(file: string | File): void {
    const currentFiles = watch('confirmFiles') || [];
    let updatedFiles;
    if (typeof file === 'string') {
      // If file is a string (URL), remove by name or URL
      updatedFiles = currentFiles.filter((f: File) => f.name !== file && (f as any) !== file);
    } else {
      // If file is a File object, remove by reference or name
      updatedFiles = currentFiles.filter((f: File) => f !== file && f.name !== file.name);
    }
    setValue('confirmFiles', updatedFiles, { shouldDirty: true });
  }

  function handleRemoveAll(): void {
    setValue('confirmFiles', [], { shouldDirty: true });
  }

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Xác nhận và hoàn tất phiếu mượn thiết bị
        </Typography>
        <Stack spacing={2}>
          <RHFUploadMultiFile
            name="confirmFiles"
            showPreview
            maxSize={3145728}
            onDrop={handleDrop}
            onRemove={handleRemove}
            onRemoveAll={handleRemoveAll}
            onUpload={() => console.log('ON UPLOAD')}
          />
          {progress > 0 && progress < 100 && (
            <Typography color="primary">Đang tải lên: {Math.round(progress)}%</Typography>
          )}
          {error && <Typography color="error">{error}</Typography>}
          <Stack justifyContent={'flex-end'} direction="row" spacing={2} mt={2}>
            <Box>
              <Button color="inherit" onClick={() => dispatch(onBackStep())}>
                Quay lại
              </Button>
            </Box>
            <Box>
              <Button
                type="submit"
                variant="contained"
                disabled={!isDirty || isSubmitting}
                startIcon={isSubmitting && <CircularProgress size={20} />}
              >
                Xác nhận hoàn tất
              </Button>
            </Box>
          </Stack>
        </Stack>
      </FormProvider>
    </Card>
  );
}
