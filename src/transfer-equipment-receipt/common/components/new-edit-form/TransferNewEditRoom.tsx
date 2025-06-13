// form
import { useFormContext } from 'react-hook-form';
// @mui
import { Stack, Divider, Typography, Button } from '@mui/material';
// hooks
import useToggle from 'src/common/hooks/useToggle';
import useResponsive from 'src/common/hooks/useResponsive';
// _mock
// import your mock room data here if needed
// components
import Iconify from 'src/common/components/Iconify';
import TransferRoomListDialog from './TransferRoomListDialog';
import { useSelector } from 'src/common/redux/store';

// ----------------------------------------------------------------------

export default function TransferNewEditRoom() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const upMd = useResponsive('up', 'md');

  const { roomOptionsFrom, roomOptionsTo } = useSelector((state) => state.transferEditNew);

  const values = watch();

  const { toggle: openFrom, onOpen: onOpenFrom, onClose: onCloseFrom } = useToggle();

  const { toggle: openTo, onOpen: onOpenTo, onClose: onCloseTo } = useToggle();

  const { roomFrom, roomTo } = values;

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
            Chuyển từ phòng:
          </Typography>
          <Button size="small" startIcon={<Iconify icon="eva:edit-fill" />} onClick={onOpenFrom}>
            Thay đổi
          </Button>
          <TransferRoomListDialog
            open={openFrom}
            onClose={onCloseFrom}
            selected={(selectedId: string) => roomFrom?.id === selectedId}
            onSelect={(room) => {
              setValue('roomFrom', room);
              setValue('transferFrom', room?.id);
            }}
            roomOptions={roomOptionsFrom}
          />
        </Stack>
        {roomFrom ? (
          <RoomInfo
            id={roomFrom.id}
            name={roomFrom.name}
            department={roomFrom.department?.name}
            notes={roomFrom.notes}
          />
        ) : (
          <Typography typography="caption" sx={{ color: 'error.main' }}>
            {(errors.roomFrom as any)?.message}
          </Typography>
        )}
      </Stack>

      <Stack sx={{ width: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            Chuyển đến phòng:
          </Typography>
          <Button
            size="small"
            startIcon={<Iconify icon={roomTo ? 'eva:edit-fill' : 'eva:plus-fill'} />}
            onClick={onOpenTo}
          >
            {roomTo ? 'Thay đổi' : 'Thêm'}
          </Button>
          <TransferRoomListDialog
            open={openTo}
            onClose={onCloseTo}
            selected={(selectedId: string) => roomTo?.id === selectedId}
            onSelect={(room) => {
              setValue('roomTo', room);
              setValue('transferTo', room?.id);
            }}
            roomOptions={roomOptionsTo}
          />
        </Stack>
        {roomTo ? (
          <RoomInfo
            id={roomTo.id}
            name={roomTo.name}
            department={roomTo.department?.name}
            notes={roomTo.notes}
          />
        ) : (
          <Typography typography="caption" sx={{ color: 'error.main' }}>
            {(errors.roomTo as any)?.message}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type RoomInfoProps = {
  id?: string;
  name: string;
  department: string;
  notes: string;
};

function RoomInfo({ id, name, department, notes }: RoomInfoProps) {
  return (
    <>
      <Typography variant="subtitle2">{`Tên phòng: ${name}`}</Typography>
      <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
        {id ? `Mã phòng: ${id}` : 'No ID available'}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
        {`Khoa: ${department}`}
      </Typography>
      <Typography variant="body2">{`Ghi chú: ${notes}`}</Typography>
    </>
  );
}
