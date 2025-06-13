import { useEffect } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Box, Stack, Button, Divider, Typography } from '@mui/material';
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
      deviceName: '',
      quantity: '',
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  useEffect(() => {}, [watch('items')]);

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Box sx={{ width: 380 }}>
          <RHFUploadSingleFile
            name="image"
            accept={{ 'image/*': [] }}
            helperText="Chỉ chấp nhận file hình ảnh (jpg, png...)"
          />
        </Box>

        <Typography variant="h6" sx={{ color: 'text.disabled' }}>
          Danh sách thiết bị cần sửa
        </Typography>

        <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
          {fields.map((item, index) => (
            <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                <RHFTextField
                  size="small"
                  name={`items[${index}].serialNumber`}
                  label="Số serial thiết bị"
                  InputLabelProps={{ shrink: true }}
                />
                <RHFTextField
                  size="small"
                  name={`items[${index}].deviceName`}
                  label="Tên thiết bị"
                  InputLabelProps={{ shrink: true }}
                />
                <RHFTextField
                  size="small"
                  type="number"
                  name={`items[${index}].quantity`}
                  label="Số lượng"
                  placeholder="0"
                  InputLabelProps={{ shrink: true }}
                  sx={{ maxWidth: { md: 96 } }}
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

        <Button size="small" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleAdd}>
          Thêm thiết bị
        </Button>
      </Stack>
    </Box>
  );
}
