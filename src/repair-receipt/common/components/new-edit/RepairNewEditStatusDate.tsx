import { Stack, MenuItem } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { RHFTextField, RHFSelect, RHFEditor } from 'src/common/components/hook-form';

export default function RepairReceiptStatusDate() {
  const { control, watch } = useFormContext();

  const startDate = watch('startDate');

  return (
    <Stack sx={{ p: 3, bgcolor: 'background.neutral' }} spacing={2}>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
        <RHFTextField name="userCode" label="Mã người tạo phiếu" />

        <RHFTextField
          name="startDate"
          label="Ngày bắt đầu"
          type="date"
          InputLabelProps={{ shrink: true }}
        />

        <Controller
          name="endDate"
          control={control}
          rules={{
            validate: (value: string) => {
              if (!value || !startDate) return true;
              return (
                new Date(value) >= new Date(startDate) ||
                'Ngày hoàn thành phải sau hoặc bằng ngày bắt đầu'
              );
            },
          }}
          render={({ field, fieldState }) => (
            <RHFTextField
              {...field}
              label="Ngày hoàn thành"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <RHFSelect name="status" label="Trạng thái">
          <MenuItem value="pending">Chờ xử lý</MenuItem>
          <MenuItem value="repairing">Đang sửa</MenuItem>
          <MenuItem value="completed">Hoàn tất</MenuItem>
        </RHFSelect>
      </Stack>

      <RHFTextField name="responsiblePerson" label="Người phụ trách" />

      <RHFEditor name="note" />
    </Stack>
  );
}
