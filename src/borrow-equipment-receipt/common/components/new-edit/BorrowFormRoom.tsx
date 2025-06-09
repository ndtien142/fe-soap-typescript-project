import { useFormContext } from 'react-hook-form';
// @mui
import { Stack, Typography, CircularProgress, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { RHFSelect } from 'src/common/components/hook-form';

// ----------------------------------------------------------------------

export default function BorrowFormRoom() {
  const { setValue, watch } = useFormContext();
  const values = watch();

  const [roomOptions, setRoomOptions] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/rooms') // Replace with your actual API endpoint
      .then((res) => {
        const rooms = res.data?.metadata?.metadata || [];
        setRoomOptions(rooms.map((room: any) => ({ id: room.id, name: room.name })));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled' }}>
        Phòng mượn thiết bị
      </Typography>
      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <RHFSelect
          name="roomId"
          label="Chọn phòng"
          value={values.roomId}
          onChange={(e) => setValue('roomId', e.target.value)}
          disabled={false}
        >
          <MenuItem value="">Chọn phòng</MenuItem>
          {roomOptions.map((room) => (
            <MenuItem key={room.id} value={room.id}>
              {room.name}
            </MenuItem>
          ))}
        </RHFSelect>
      )}
    </Stack>
  );
}
