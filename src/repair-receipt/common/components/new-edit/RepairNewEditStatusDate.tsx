import { Stack, MenuItem } from '@mui/material';
import { RHFTextField, RHFSelect, RHFEditor } from 'src/common/components/hook-form';

export default function RepairReceiptStatusDate() {
  return (
    <Stack sx={{ p: 3, bgcolor: 'background.neutral' }} spacing={2}>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
        <RHFTextField
          name="userCode"
          label="Mã người tạo phiếu"
        />

        <RHFTextField
          name="startDate"
          label="Ngày bắt đầu"
          type="date"
          InputLabelProps={{ shrink: true }}
        />

        <RHFTextField
          name="endDate"
          label="Ngày hoàn thành"
          type="date"
          InputLabelProps={{ shrink: true }}
        />

        <RHFSelect name="status" label="Trạng thái">
          <MenuItem value="pending">Chờ xử lý</MenuItem>
          <MenuItem value="repairing">Đang sửa</MenuItem>
          <MenuItem value="completed">Hoàn tất</MenuItem>
        </RHFSelect>
      </Stack>

      <RHFTextField
        name="responsiblePerson"
        label="Người phụ trách"
      />

      <RHFEditor name="note"/>
    </Stack>
  );
}
