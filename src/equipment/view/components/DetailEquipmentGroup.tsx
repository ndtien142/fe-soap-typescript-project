import React, { useCallback } from 'react';
import { Card, Stack, Typography, Divider, Box, Grid } from '@mui/material';
import { IEquipmentGroupDetail } from 'src/common/@types/equipment/equipment.interface';
import { FormProvider, RHFTextField, RHFUploadMultiFile } from 'src/common/components/hook-form';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { CustomFile } from 'src/common/components/upload';
import Label from 'src/common/components/Label';

// ----------------------------------------------------------------------

type DetailEquipmentGroupProps = {
  data?: IEquipmentGroupDetail | null;
  isLoading?: boolean;
};

interface FormValuesProps {
  images: (CustomFile | string)[];
}

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const DetailEquipmentGroup = ({ data, isLoading }: DetailEquipmentGroupProps) => {
  const methods = useForm<FormValuesProps>({
    defaultValues: {
      images: [],
    },
  });

  const { setValue, watch } = methods;

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

  if (isLoading) {
    return <Typography>Đang tải chi tiết nhóm thiết bị...</Typography>;
  }

  if (!data) {
    return <Typography>Không tìm thấy thông tin nhóm thiết bị.</Typography>;
  }

  // Determine status color and text
  const statusColor = data.isDeleted ? 'error' : data.isActive ? 'success' : 'warning';
  const statusText = data.isDeleted
    ? 'Đã xóa'
    : data.isActive
    ? 'Đang hoạt động'
    : 'Ngừng hoạt động';

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(() => {})}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, position: 'relative' }}>
            <Label
              color={statusColor}
              sx={{
                position: 'absolute',
                top: 24,
                right: 24,
                textTransform: 'uppercase',
                zIndex: 1,
              }}
            >
              {statusText}
            </Label>
            <Typography variant="h5" gutterBottom>
              {data.name}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <RHFTextField
                name="code"
                label="Mã nhóm thiết bị"
                value={data.code}
                disabled
                fullWidth
              />
              <RHFTextField
                name="name"
                label="Tên nhóm thiết bị"
                value={data.name}
                disabled
                fullWidth
              />
              <RHFTextField
                name="description"
                label="Mô tả"
                value={data.description || 'Không có'}
                disabled
                fullWidth
              />
              <RHFTextField
                name="unitOfMeasure"
                label="Đơn vị tính"
                value={data.unitOfMeasure?.name || '-'}
                disabled
                fullWidth
              />
              <RHFTextField
                name="type"
                label="Loại thiết bị"
                value={data.type?.name || '-'}
                disabled
                fullWidth
              />
              <RHFTextField
                name="manufacturer"
                label="Nhà sản xuất"
                value={data.manufacturer?.name || '-'}
                disabled
                fullWidth
              />
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              {/* <div>
                <LabelStyle>Mô tả</LabelStyle>
                <RHFEditor simple name="description" />
              </div> */}
              <div>
                <LabelStyle>Hình ảnh</LabelStyle>
                <RHFUploadMultiFile
                  showPreview
                  name="images"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                  onUpload={() => {}}
                />
              </div>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default DetailEquipmentGroup;
