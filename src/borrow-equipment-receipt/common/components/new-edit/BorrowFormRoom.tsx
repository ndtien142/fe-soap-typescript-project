import { useFormContext } from 'react-hook-form';
// @mui
import { Stack, Typography, CircularProgress, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { RHFSelect } from 'src/common/components/hook-form';
import { useGetListRoom } from '../../hooks/useGetListRoom';

// ----------------------------------------------------------------------

export default function BorrowFormRoom() {
  const { setValue, watch } = useFormContext();
  const values = watch();

  const [roomOptions, setRoomOptions] = useState<
    { id: string; name: string; departmentName: string }[]
  >([]);

  const {
    data: rooms,
    isLoading,
    fetchData,
  } = useGetListRoom({
    onSuccess: () => {},
    onError: () => {},
  });

  useEffect(() => {
    fetchData({ page: 1, limit: 100 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rooms && Array.isArray(rooms)) {
      console.log('Fetched rooms:', rooms);
      setRoomOptions(
        rooms.map((room) => ({
          id: room.id,
          name: room.name,
          departmentName: room.department?.name || '',
        }))
      );
    }
  }, [rooms]);

  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled' }}>
        Phòng mượn thiết bị
      </Typography>
      <RHFSelect
        name="roomId"
        label="Chọn phòng"
        value={values.roomId}
        onChange={(e) => setValue('roomId', e.target.value)}
        InputLabelProps={{ shrink: true }}
        SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
        fullWidth
      >
        <MenuItem value="">Chọn phòng</MenuItem>
        {isLoading ? (
          <MenuItem disabled value="">
            <CircularProgress size={16} sx={{ mr: 1 }} /> Đang tải phòng...
          </MenuItem>
        ) : roomOptions.length === 0 ? (
          <MenuItem disabled value="">
            Không có phòng nào khả dụng
          </MenuItem>
        ) : (
          roomOptions.map((room) => (
            <MenuItem
              key={room.id}
              value={room.id}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
            >
              {room.name}
              {room.departmentName ? ` - ${room.departmentName}` : ''}
            </MenuItem>
          ))
        )}
      </RHFSelect>
    </Stack>
  );
}
