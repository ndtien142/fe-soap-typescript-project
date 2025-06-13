// @mui
import { Dialog, ListItemButton, Stack, Typography } from '@mui/material';
import { IRoom } from 'src/common/@types/department/department.interface';
// components
import Iconify from 'src/common/components/Iconify';
import Scrollbar from 'src/common/components/Scrollbar';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  selected: (selectedId: string) => boolean;
  onClose: VoidFunction;
  onSelect: (room: IRoom | null) => void;
  roomOptions: IRoom[];
};

export default function DialogSelectRoom({
  open,
  selected,
  onClose,
  onSelect,
  roomOptions,
}: Props) {
  const handleSelect = (room: IRoom | null) => {
    onSelect(room);
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ py: 2.5, px: 3 }}
      >
        <Typography variant="h6">Chọn phòng</Typography>
      </Stack>

      <Scrollbar sx={{ p: 1.5, pt: 0, maxHeight: 80 * 8 }}>
        {roomOptions.map((room) => (
          <ListItemButton
            key={room.id}
            selected={selected(room.id)}
            onClick={() => handleSelect(room)}
            sx={{
              p: 1.5,
              borderRadius: 1,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Typography variant="subtitle2">
              {room.name} (ID: {room.id})
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Khoa/Phòng: {room.department?.name}
            </Typography>
          </ListItemButton>
        ))}
      </Scrollbar>
    </Dialog>
  );
}
