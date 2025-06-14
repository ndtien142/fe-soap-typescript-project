import { useState, useCallback } from 'react';
import { Box, Card, Typography, Stack, Button, CircularProgress } from '@mui/material';
import { RHFUploadMultiFile, FormProvider } from 'src/common/components/hook-form';
import { useForm } from 'react-hook-form';
import useFirebaseUpload from 'src/common/hooks/useFirebaseUpload';
import axiosInstance from 'src/common/utils/axios';
import { API_BORROW_RECEIPT, API_UPLOAD_MULTIPLE_FILE } from 'src/common/constant/api.constant';
import { useParams } from 'react-router-dom';
import { default as useMessage } from 'src/common/hooks/useMessage';
import { useDispatch } from 'src/common/redux/store';
import { onBackStep } from 'src/borrow-equipment-receipt/scan/scan.slice';

type FormValues = {
  images: (File & { preview?: string })[];
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
    defaultValues: { images: [] },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = methods;

  const { uploadFile, progress, error } = useFirebaseUpload();

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
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
    if (!images.length) {
      showErrorSnackbar('Vui lòng chọn file xác nhận!');
      return;
    }
    setIsSubmitting(true);
    try {
      const urls = await Promise.all(images.map((file) => uploadFile(file, 'borrow-confirm')));
      // Prepare files array for BE
      const files = images.map((file, idx) => ({
        filePath: urls[idx],
        fileName: file.name,
        note: '',
      }));
      // Wrap in equipmentFiles as required by new API
      const equipmentFiles = [
        {
          files,
        },
      ];
      await axiosInstance.post(`${API_BORROW_RECEIPT}/${id}/confirm-borrowed`, { equipmentFiles });
      showSuccessSnackbar('Tải lên và lưu file thành công!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      showErrorSnackbar(err?.message || 'Tải lên thất bại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  function handleRemove(file: string | File): void {
    const currentFiles = watch('images') || [];
    let updatedFiles;
    if (typeof file === 'string') {
      updatedFiles = currentFiles.filter((f: File) => f.name !== file && (f as any) !== file);
    } else {
      updatedFiles = currentFiles.filter((f: File) => f !== file && f.name !== file.name);
    }
    setValue('images', updatedFiles, { shouldDirty: true });
  }

  function handleRemoveAll(): void {
    setValue('images', [], { shouldDirty: true });
  }

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(handleUpload)}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Xác nhận và hoàn tất phiếu mượn thiết bị
        </Typography>
        <Stack spacing={2}>
          <RHFUploadMultiFile
            name="images"
            showPreview
            maxSize={3145728}
            onDrop={handleDrop}
            onRemove={handleRemove}
            onRemoveAll={handleRemoveAll}
            onUpload={handleUpload}
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
