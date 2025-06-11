import { useFormContext } from 'react-hook-form';
// @mui
import { Stack, Divider, Typography, Button } from '@mui/material';
import { useEffect } from 'react';
import useToggle from 'src/common/hooks/useToggle';
import useResponsive from 'src/common/hooks/useResponsive';
import { useGetListRoom } from '../../hooks/useGetListRoom';
import Iconify from 'src/common/components/Iconify';
import DialogSelectRoom from './DialogSelectRoom';

// ----------------------------------------------------------------------

export default function BorrowFormRoom() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const upMd = useResponsive('up', 'md');
  const {
    toggle: openRoom,
    onOpen: onOpenRoom,
    onClose: onCloseRoom,
  }: { toggle: boolean; onOpen: () => void; onClose: () => void } = useToggle();

  const values = watch();
  const room = values.room || {};

  // Call API to get rooms
  const {
    data: roomOptions,
    isLoading: isLoadingRooms,
    fetchData: fetchRooms,
  } = useGetListRoom({ onSuccess: () => {}, onError: () => {} });

  useEffect(() => {
    fetchRooms({ page: 1, limit: 100 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Disable all fields if status is not 'requested'
  const isStatusReceived = values.status === 'received';
  const isStatusApproved = values.status === 'approved';
  const isStatusRejected = values.status === 'rejected';
  const allDisabled = isStatusReceived || isStatusApproved || isStatusRejected;

  const handleSelectRoom = (selectedRoom: any) => {
    setValue('roomId', selectedRoom?.id || '');
    setValue('room', selectedRoom || {}, { shouldValidate: true, shouldDirty: true });
  };

  const roomError = errors?.room;

  return (
    <Stack
      spacing={{ xs: 2, md: 5 }}
      direction={{ xs: 'column', md: 'row' }}
      divider={
        <Divider
          flexItem
          orientation={upMd ? 'vertical' : 'horizontal'}
          sx={{ borderStyle: 'dashed' }}
        />
      }
      sx={{ p: 3 }}
    >
      <Stack sx={{ width: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            Phòng mượn thiết bị
          </Typography>
          <Button
            size="small"
            startIcon={<Iconify icon="eva:edit-fill" />}
            onClick={onOpenRoom}
            disabled={allDisabled}
          >
            Chọn
          </Button>
          <DialogSelectRoom
            open={openRoom}
            onClose={onCloseRoom}
            selected={(id: string) => room?.id === id}
            onSelect={handleSelectRoom}
            roomOptions={roomOptions || []}
          />
        </Stack>
        <RoomInfo name={room.name} id={room.id} departmentName={room.department?.name} />
        {roomError && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {'Vui lòng chọn phòng'}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type RoomInfoProps = {
  name?: string;
  id?: string;
  departmentName?: string;
};

function RoomInfo({ name, id, departmentName }: RoomInfoProps) {
  return (
    <>
      <Typography variant="subtitle2">
        {name ? `${name} (ID: ${id})` : 'Chưa chọn phòng'}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
        {departmentName ? `Khoa/Phòng: ${departmentName}` : ''}
      </Typography>
    </>
  );
}
