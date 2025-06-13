import sum from 'lodash/sum';
import { useEffect } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import {
  Box,
  Stack,
  Button,
  Divider,
  Typography,
  InputAdornment,
} from '@mui/material';
import { RHFTextField } from 'src/common/components/hook-form';
import Iconify from 'src/common/components/Iconify';
import { fCurrency, fNumber } from 'src/common/utils/formatNumber';

export default function LiquidationNewEditDetails() {
  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const values = watch();

  // Tính thành tiền mỗi dòng
  const totalOnRow = values.items?.map(
    (item: any) => (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
  ) || [];

  const totalPrice = sum(totalOnRow) - (values.discount || 0) + (values.taxes || 0);

  useEffect(() => {
    setValue('totalPrice', totalPrice);
  }, [setValue, totalPrice]);

  const handleAdd = () => {
    append({
      serialNumber: '',
      deviceName: '',
      quantity: 1,
      unitPrice: 0,
      note: '',
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Danh sách thiết bị thanh lý
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => (
          <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <RHFTextField
                size="small"
                name={`items[${index}].serialNumber`}
                label="Mã thiết bị"
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
              <RHFTextField
                size="small"
                type="number"
                name={`items[${index}].unitPrice`}
                label="Đơn giá"
                placeholder="0"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₫</InputAdornment>,
                }}
                sx={{ maxWidth: { md: 120 } }}
              />
              <RHFTextField
                name={`items[${index}].total`}
                disabled
                size="small"
                label="Thành tiền"
                value={fNumber(totalOnRow[index])}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₫</InputAdornment>,
                }}
                sx={{ maxWidth: { md: 120 } }}
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

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Stack
        spacing={2}
        direction={{ xs: 'column-reverse', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <Button
          size="small"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
        >
          Thêm Thiết Bị
        </Button>

        <Stack
          spacing={2}
          justifyContent="flex-end"
          direction={{ xs: 'column', md: 'row' }}
          sx={{ width: 1 }}
        >
          <RHFTextField
            size="small"
            label="Giảm giá"
            name="discount"
            type="number"
            onChange={(event) => setValue('discount', Number(event.target.value))}
            sx={{ maxWidth: { md: 200 } }}
          />

          <RHFTextField
            size="small"
            label="Thuế"
            name="taxes"
            type="number"
            onChange={(event) => setValue('taxes', Number(event.target.value))}
            sx={{ maxWidth: { md: 200 } }}
          />
        </Stack>
      </Stack>

      <Stack spacing={2} sx={{ mt: 3 }}>
        <Stack direction="row" justifyContent="flex-end">
          <Typography>Tạm tính :</Typography>
          <Typography sx={{ textAlign: 'right', width: 120 }}>
            {fCurrency(sum(totalOnRow))}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Typography>Giảm giá :</Typography>
          <Typography
            sx={{ textAlign: 'right', width: 120, ...(values.discount && { color: 'error.main' }) }}
          >
            {values.discount ? `- ${fCurrency(values.discount)}` : '-'}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Typography>Thuế :</Typography>
          <Typography sx={{ textAlign: 'right', width: 120 }}>
            {values.taxes ? fCurrency(values.taxes) : '-'}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Typography variant="h6">Tổng cộng :</Typography>
          <Typography variant="h6" sx={{ textAlign: 'right', width: 120 }}>
            {fCurrency(totalPrice)}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
