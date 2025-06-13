// form
import { useFormContext, Controller } from 'react-hook-form';
import { useEffect } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { Stack, TextField, MenuItem } from '@mui/material';
// components
import { RHFEditor, RHFSelect, RHFTextField } from 'src/common/components/hook-form';

// ----------------------------------------------------------------------

export default function ImportNewEditStatusDate({
  statusOptions,
  isEdit,
}: {
  statusOptions?: string[];
  isEdit?: boolean;
}) {
  const { control, watch, setValue } = useFormContext();

  const values = watch();

  // Ensure dateOfActualReceived is null on create
  useEffect(() => {
    if (!values.dateOfActualReceived) {
      setValue('dateOfActualReceived', null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const STATUS_OPTIONS = statusOptions || [
    'requested',
    'approved',
    'processing',
    'received',
    'returned',
    'rejected',
  ];

  const isStatusReceived = values.status === 'received';
  const isStatusApproved = values.status === 'approved';
  const isStatusRejected = values.status === 'rejected';
  const allDisabled = isStatusReceived || isStatusApproved || isStatusRejected;

  return (
    <Stack spacing={2} sx={{ p: 3, bgcolor: 'background.neutral' }}>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
        <RHFTextField
          name="name"
          label="Tên phiếu nhập"
          disabled={isEdit || allDisabled}
          value={values.name}
        />

        <RHFSelect
          fullWidth
          name="status"
          label="Trạng thái"
          InputLabelProps={{ shrink: true }}
          SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
          disabled={allDisabled}
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem
              key={option}
              value={option}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
            >
              {option}
            </MenuItem>
          ))}
        </RHFSelect>

        <Controller
          name="dateOfOrder"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DatePicker
              label="Ngày đặt hàng"
              value={field.value}
              onChange={(newValue) => {
                field.onChange(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  disabled={allDisabled}
                />
              )}
            />
          )}
        />

        <Controller
          name="dateOfReceived"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DatePicker
              label="Ngày nhận hàng dự kiến"
              value={field.value}
              onChange={(newValue) => {
                field.onChange(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  disabled={allDisabled}
                />
              )}
            />
          )}
        />

        {isStatusReceived && (
          <Controller
            name="dateOfActualReceived"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Ngày nhận hàng thực tế"
                value={field.value}
                onChange={() => {}}
                renderInput={(params) => <TextField {...params} fullWidth disabled />}
              />
            )}
          />
        )}
      </Stack>
      <RHFEditor name="note" />
    </Stack>
  );
}
