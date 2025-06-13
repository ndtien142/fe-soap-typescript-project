import { useEffect } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import {
  Box,
  Stack,
  Button,
  Divider,
  Typography,
} from '@mui/material';
import { RHFTextField, RHFUploadSingleFile } from 'src/common/components/hook-form';
import Iconify from 'src/common/components/Iconify';

export default function RepairReceiptDetails() {
  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const values = watch();

  const handleAdd = () => {
    append({
      serialNumber: '',
      note: '',
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  useEffect(() => {
    // Nếu sau này cần xử lý gì thêm khi items thay đổi
  }, [watch('items')]);

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <RHFTextField name="title" label="Tên phiếu" />

        <RHFTextField name="reason" label="Lý do sửa chữa" multiline rows={3} />

        <RHFUploadSingleFile
          name="image"
        //   label="Ảnh thiết bị (tuỳ chọn)"
          accept={{ 'image/*': [] }}
          helperText="Chỉ chấp nhận file hình ảnh (jpg, png...)"
        />

        <Typography variant="h6" sx={{ color: 'text.disabled' }}>
          Danh sách thiết bị cần sửa
        </Typography>

        <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
          {fields.map((item, index) => (
            <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                sx={{ width: 1 }}
              >
                <RHFTextField
                  size="small"
                  name={`items[${index}].serialNumber`}
                  label="Số serial thiết bị"
                  InputLabelProps={{ shrink: true }}
                />
                <RHFTextField
                  size="small"
                  name={`items[${index}].note`}
                  label="Ghi chú"
                  InputLabelProps={{ shrink: true }}
                />
                <Button
                  size="small"
                  color="error"
                  startIcon={<Iconify icon="eva:trash-2-outline" />}
                  onClick={() => handleRemove(index)}
                >
                  Xóa
                </Button>
              </Stack>
            </Stack>
          ))}
        </Stack>

        <Button
          size="small"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleAdd}
        >
          Thêm thiết bị
        </Button>
      </Stack>
    </Box>
  );
}
