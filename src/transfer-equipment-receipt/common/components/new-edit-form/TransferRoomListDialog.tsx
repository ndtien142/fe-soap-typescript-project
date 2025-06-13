import { Dialog, ListItemButton, Stack, Typography, Button } from '@mui/material';
import { IRoom } from 'src/common/@types/department/department.interface';
import Iconify from 'src/common/components/Iconify';
import Scrollbar from 'src/common/components/Scrollbar';

type Props = {
  open: boolean;
  selected: (selectedId: string) => boolean;
  onClose: VoidFunction;
  onSelect: (room: IRoom | null) => void;
  roomOptions: IRoom[];
};

export default function TransferRoomListDialog({
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
        <Button
          size="small"
          variant="outlined"
          startIcon={<Iconify icon="eva:plus-fill" />}
          sx={{ alignSelf: 'flex-end' }}
        >
          Thêm mới
        </Button>
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
            <Typography variant="subtitle2">{room.name}</Typography>
            <Typography variant="subtitle2">{room.id}</Typography>
            <Typography
              variant="caption"
              sx={{ color: 'primary.main', my: 0.5, fontWeight: 'fontWeightMedium' }}
            >
              {room.department?.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {room.notes}
            </Typography>
          </ListItemButton>
        ))}
      </Scrollbar>
    </Dialog>
  );
}
