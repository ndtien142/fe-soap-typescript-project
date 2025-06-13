import { useFormContext } from 'react-hook-form';
import { Stack, MenuItem } from '@mui/material';
import { RHFTextField, RHFSelect, RHFEditor } from 'src/common/components/hook-form';

export default function LiquidationNewEditStatusDate() {
  return (
    <Stack sx={{ p: 3, bgcolor: 'background.neutral' }} spacing={2}>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
        <RHFTextField
          name="userCode"
          label="Mã người thanh lý"
          disabled={false}
        />

        <RHFTextField
          name="liquidationDate"
          label="Ngày thanh lý"
          type="date"
          InputLabelProps={{ shrink: true }}
          disabled={false}
        />

        <RHFSelect name="status" label="Trạng thái">
          <MenuItem value="requested">Yêu cầu</MenuItem>
          <MenuItem value="approved">Đã duyệt</MenuItem>
          <MenuItem value="rejected">Từ chối</MenuItem>
        </RHFSelect>
      </Stack>

      <RHFEditor name="note" />
    </Stack>
  );
}
