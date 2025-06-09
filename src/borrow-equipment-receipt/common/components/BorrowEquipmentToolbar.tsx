import { Stack, InputAdornment, TextField, MenuItem } from '@mui/material';
import Iconify from 'src/common/components/Iconify';

const INPUT_WIDTH = 160;

interface Props {
  filterUser: string;
  filterRoom: string;
  filterStatus: string;
  onFilterUser: (value: string) => void;
  onFilterRoom: (value: string) => void;
  onFilterStatus: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'requested', label: 'Đã yêu cầu' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'borrowed', label: 'Đang mượn' },
  { value: 'returned', label: 'Đã trả' },
  { value: 'rejected', label: 'Từ chối' },
];

export default function BorrowEquipmentToolbar({
  filterUser,
  filterRoom,
  filterStatus,
  onFilterUser,
  onFilterRoom,
  onFilterStatus,
}: Props) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        value={filterUser}
        onChange={(e) => onFilterUser(e.target.value)}
        placeholder="Tìm kiếm người yêu cầu..."
        label="Người yêu cầu"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
        sx={{
          //   maxWidth: { md: INPUT_WIDTH },
          textTransform: 'capitalize',
        }}
      />
      <TextField
        fullWidth
        value={filterRoom}
        onChange={(e) => onFilterRoom(e.target.value)}
        placeholder="Tìm kiếm phòng..."
        label="Phòng"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
        sx={{
          maxWidth: { md: INPUT_WIDTH },
          textTransform: 'capitalize',
        }}
      />
      <TextField
        fullWidth
        select
        label="Trạng thái"
        value={filterStatus}
        onChange={onFilterStatus}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } },
          },
        }}
        sx={{
          maxWidth: { md: INPUT_WIDTH },
          textTransform: 'capitalize',
        }}
      >
        {STATUS_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}
