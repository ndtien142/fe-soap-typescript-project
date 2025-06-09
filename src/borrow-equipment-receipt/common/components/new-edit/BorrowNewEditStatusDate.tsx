import { useFormContext } from 'react-hook-form';
import { Stack, MenuItem } from '@mui/material';
import { RHFTextField, RHFSelect, RHFEditor } from 'src/common/components/hook-form';

// ----------------------------------------------------------------------

export default function BorrowNewEditStatusDate() {
  const { watch } = useFormContext();
  const values = watch();

  return (
    <Stack sx={{ p: 3, bgcolor: 'background.neutral' }} spacing={2}>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
        {/* <RHFTextField name="userCode" label="Mã người mượn" disabled={false} /> */}
        <RHFTextField
          name="borrowDate"
          label="Ngày mượn"
          type="date"
          InputLabelProps={{ shrink: true }}
          disabled={false}
        />
        <RHFTextField
          name="returnDate"
          label="Ngày trả"
          type="date"
          InputLabelProps={{ shrink: true }}
          disabled={false}
        />
        <RHFSelect name="type" label="Loại mượn" disabled={false}>
          <MenuItem value="specific">Cụ thể</MenuItem>
          <MenuItem value="random">Ngẫu nhiên</MenuItem>
        </RHFSelect>
      </Stack>
      <RHFEditor name="note" />
    </Stack>
  );
}
