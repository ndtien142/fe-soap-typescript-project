import sum from 'lodash/sum';
import { useEffect } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Box, Stack, Button, Divider, Typography, MenuItem, CircularProgress } from '@mui/material';
import { fCurrency, fNumber } from 'src/common/utils/formatNumber';
import { RHFSelect, RHFTextField } from 'src/common/components/hook-form';
import Iconify from 'src/common/components/Iconify';
import { useGetListEquipmentGroup } from 'src/equipment/list-group-equipment/hooks/useGetListGroupEquipment';

// ----------------------------------------------------------------------

export default function BorrowNewEditDetails() {
  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'groups',
  });

  const {
    data: groupOptions,
    isLoading,
    fetchData,
  } = useGetListEquipmentGroup({ onSuccess: () => {}, onError: () => {} });

  useEffect(() => {
    fetchData({ page: 1, limit: 100 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const values = watch();

  // Calculate total quantity
  const totalQuantity = values.groups
    ? sum(values.groups.map((item: any) => Number(item.quantity) || 0))
    : 0;

  // Disable all fields if status is not 'requested'
  const isStatusReceived = values.status === 'received';
  const isStatusApproved = values.status === 'approved';
  const isStatusRejected = values.status === 'rejected';
  const allDisabled = isStatusReceived || isStatusApproved || isStatusRejected;

  // Handle change for groupEquipmentCode and update groupEquipmentName using field array update
  const handleGroupCodeChange = (index: number, selectedCode: string) => {
    // Only update if groupOptions is loaded and not empty
    if (!groupOptions || groupOptions.length === 0) {
      setValue(
        'groups',
        fields.map((f, i) =>
          i === index
            ? {
                ...f,
                groupEquipmentCode: '',
                groupEquipmentName: '',
              }
            : f
        )
      );
      return;
    }
    const selected = groupOptions.find((eq: any) => eq.code === selectedCode);
    setValue(
      'groups',
      fields.map((f, i) =>
        i === index
          ? {
              ...f,
              groupEquipmentCode: selectedCode,
              groupEquipmentName: selected ? selected.name : '',
            }
          : f
      )
    );
  };

  // Handle change for quantity using field array update
  const handleQuantityChange = (index: number, value: number) => {
    setValue(
      'groups',
      fields.map((f, i) =>
        i === index
          ? {
              ...f,
              quantity: value,
            }
          : f
      )
    );
  };

  console.log('fields', fields);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Danh sách nhóm thiết bị mượn
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => {
          const watchedCode = watch(`groups.${index}.groupEquipmentCode`);
          const availableCodes = groupOptions?.map((opt: any) => opt.code) || [];
          const selectValue =
            typeof watchedCode === 'string' && availableCodes.includes(watchedCode)
              ? watchedCode
              : '';
          return (
            <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                alignItems={'center'}
                justifyContent={'space-between'}
                spacing={2}
                sx={{ width: 1 }}
              >
                <Controller
                  name={`groups.${index}.groupEquipmentCode`}
                  control={control}
                  render={({ field }) => (
                    <RHFSelect
                      name={field.name}
                      value={selectValue}
                      onChange={(e) => handleGroupCodeChange(index, e.target.value)}
                      label="Chọn nhóm thiết bị"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                      sx={{ minWidth: 180 }}
                      disabled={allDisabled}
                    >
                      <MenuItem value="">-- Chọn nhóm thiết bị --</MenuItem>
                      {isLoading ? (
                        <MenuItem disabled>
                          <CircularProgress size={16} />
                        </MenuItem>
                      ) : (
                        groupOptions?.map((opt: any) => (
                          <MenuItem key={opt.code} value={opt.code}>
                            {opt.name}
                          </MenuItem>
                        ))
                      )}
                    </RHFSelect>
                  )}
                />
                <RHFTextField
                  size="small"
                  name={`groups[${index}].groupEquipmentCode`}
                  label="Mã nhóm"
                  InputLabelProps={{ shrink: true }}
                  disabled
                  value={watchedCode}
                />
                <Stack spacing={2} direction="row" alignItems="center">
                  <RHFTextField
                    name={`groups.${index}.quantity`}
                    onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                    type="number"
                    label="Số lượng"
                    size="small"
                    sx={{ width: 100 }}
                    inputProps={{ min: 1 }}
                    disabled={allDisabled}
                  />
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Iconify icon="eva:trash-2-outline" />}
                    onClick={() => remove(index)}
                    disabled={allDisabled}
                  >
                    Xóa
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          );
        })}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Button
        size="small"
        startIcon={<Iconify icon="eva:plus-fill" />}
        onClick={() => append({ groupEquipmentCode: '', groupEquipmentName: '', quantity: 1 })}
        disabled={allDisabled}
      >
        Thêm nhóm thiết bị
      </Button>

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Typography variant="subtitle2">Tổng số lượng:</Typography>
        <Typography sx={{ textAlign: 'right', width: 80, ml: 1 }}>
          {fNumber(totalQuantity)}
        </Typography>
      </Stack>
    </Box>
  );
}
