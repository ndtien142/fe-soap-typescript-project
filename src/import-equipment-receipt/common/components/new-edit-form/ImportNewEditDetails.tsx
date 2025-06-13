import sum from 'lodash/sum';
import { useEffect } from 'react';
// form
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
// @mui
import { Box, Stack, Button, Divider, Typography, InputAdornment, MenuItem } from '@mui/material';
// utils
import { fCurrency, fNumber } from 'src/common/utils/formatNumber';
// components
import { RHFSelect, RHFTextField } from 'src/common/components/hook-form';
import Iconify from 'src/common/components/Iconify';
import { useGetListEquipmentGroup } from 'src/equipment/list-group-equipment/hooks/useGetListGroupEquipment';

// ----------------------------------------------------------------------

export default function ImportNewEditDetails() {
  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const { data: equipmentGroups, fetchData } = useGetListEquipmentGroup({
    onSuccess: () => console.log('Lấy group thành công'),
    onError: (err) => console.error(err),
  });

  useEffect(() => {
    fetchData({ page: 1, limit: 50 });
  }, []);

  const values = watch();

  // Calculate row totals
  const totalOnRow = values.items.map(
    (item: any) => (Number(item.quantity) || 0) * (Number(item.price) || 0)
  );
  const totalPrice = sum(totalOnRow) - (values.discount || 0) + (values.taxes || 0);

  // Disable all fields if status is not 'requested'
  const isStatusReceived = values.status === 'received';
  const isStatusApproved = values.status === 'approved';
  const isStatusRejected = values.status === 'rejected';
  const allDisabled = isStatusReceived || isStatusApproved || isStatusRejected;

  useEffect(() => {
    setValue('totalPrice', totalPrice);
  }, [setValue, totalPrice]);

  const handleAdd = () => {
    append({
      code: '',
      name: '',
      quantity: 1,
      price: 0,
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Danh sách thiết bị nhập
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => (
          <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <Controller
                name={`items.${index}.code`}
                control={control}
                render={({ field }) => (
                  <RHFSelect
                    name={field.name}
                    value={field.value}
                    onChange={(e) => {
                      const selectedCode = e.target.value;
                      const selected = equipmentGroups.find((eq) => eq.code === selectedCode);
                      field.onChange(selectedCode);
                      // Update all items' name based on code selection
                      setValue(
                        'items',
                        fields.map((f, idx) =>
                          idx === index
                            ? {
                                ...f,
                                code: selectedCode,
                                name: selected ? selected.name : '',
                              }
                            : f
                        )
                      );
                    }}
                    label="Chọn thiết bị"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                    sx={{ minWidth: 120 }}
                    disabled={allDisabled}
                  >
                    <MenuItem value="">-- Chọn thiết bị --</MenuItem>
                    {equipmentGroups.map((eq) => (
                      <MenuItem key={eq.code} value={eq.code}>
                        {eq.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                )}
              />
              <RHFTextField
                size="small"
                name={`items[${index}].code`}
                label="Mã thiết bị"
                InputLabelProps={{ shrink: true }}
                disabled
              />
              <RHFTextField
                size="small"
                type="number"
                name={`items[${index}].quantity`}
                label="Số lượng"
                placeholder="0"
                InputLabelProps={{ shrink: true }}
                sx={{ maxWidth: { md: 96 } }}
                disabled={allDisabled}
              />
              <RHFTextField
                size="small"
                type="number"
                name={`items[${index}].price`}
                label="Đơn giá"
                placeholder="0"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₫</InputAdornment>,
                }}
                sx={{ maxWidth: { md: 120 } }}
                disabled={allDisabled}
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
                disabled={allDisabled}
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
          disabled={allDisabled}
        >
          Thêm thiết bị
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
            disabled={allDisabled}
          />

          <RHFTextField
            size="small"
            label="Thuế"
            name="taxes"
            type="number"
            onChange={(event) => setValue('taxes', Number(event.target.value))}
            sx={{ maxWidth: { md: 200 } }}
            disabled={allDisabled}
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
