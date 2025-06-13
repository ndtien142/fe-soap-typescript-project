// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { MenuItem, Stack, TextField, Typography } from '@mui/material';
// components
import { RHFTextField, RHFEditor, RHFSelect } from 'src/common/components/hook-form';
import { styled } from '@mui/material/styles';
import { useGetAllUser } from '../../hooks/useGetAllUser';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export default function TransferNewEditStatusDate() {
  const { data, fetchData } = useGetAllUser();
  const { control, watch } = useFormContext();
  const values = watch();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Stack sx={{ p: 3, bgcolor: 'background.neutral' }} spacing={2}>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
        <RHFTextField
          disabled
          name="createdAt"
          label="Ngày tạo phiếu"
          value={new Date().toLocaleString('vi-VN')}
        />

        <Controller
          name="transferDate"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DatePicker
              label="Ngày chuyển"
              value={field.value}
              onChange={field.onChange}
              renderInput={(params) => (
                <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
              )}
              disabled={false}
            />
          )}
        />

        <RHFSelect
          name="userCode"
          fullWidth
          InputLabelProps={{ shrink: true }}
          SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
          label="Người chuyển"
          FormHelperTextProps={{
            sx: { textAlign: 'right', margin: 0, mt: 1 },
          }}
        >
          {data.map((user) => (
            <MenuItem key={user.userCode} value={user.userCode}>
              {user.username}
            </MenuItem>
          ))}
        </RHFSelect>
      </Stack>
      <Stack spacing={1}>
        <LabelStyle>Ghi chú</LabelStyle>
        <RHFEditor name="notes" />
      </Stack>
    </Stack>
  );
}
