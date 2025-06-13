import { useFormContext } from 'react-hook-form';
import { default as useMessage } from 'src/common/hooks/useMessage';
import {
  Box,
  Stack,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  ListItemSecondaryAction,
} from '@mui/material';
import { IEquipment, useGetListEquipmentInRoom } from '../../hooks/useGetListEquipementInRoom';
import { useEffect } from 'react';

export default function TransferNewEditDetails() {
  const { watch, setValue } = useFormContext();

  const { showErrorSnackbar, showSuccessSnackbar } = useMessage();

  const { data: equipmentList, fetchData } = useGetListEquipmentInRoom({
    onSuccess: () => {
      showSuccessSnackbar('Danh sách thiết bị đã được tải thành công.');
    },
    onError: () => {
      showErrorSnackbar('Không thể tải danh sách thiết bị. Vui lòng thử lại sau.');
    },
  });

  useEffect(() => {
    const roomId = watch('roomFrom')?.id;
    if (roomId) {
      fetchData(roomId);
    }
  }, [watch('roomFrom')]);

  // itemsSelected: array of serialNumbers
  const itemsSelected: string[] = watch('items')?.map((item: any) => item.serialNumber) || [];

  const handleToggle = (equipment: IEquipment) => {
    const currentIndex = itemsSelected.indexOf(equipment.serialNumber);
    let newSelected: IEquipment[] = [];

    if (currentIndex === -1) {
      // Add
      newSelected = [
        ...(watch('items') || []),
        { serialNumber: equipment.serialNumber, notes: '' },
      ];
    } else {
      // Remove
      newSelected = (watch('items') || []).filter(
        (item: any) => item.serialNumber !== equipment.serialNumber
      );
    }
    setValue('items', newSelected, { shouldValidate: true });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Danh sách thiết bị trong phòng
      </Typography>
      <List>
        {(equipmentList || []).map((equipment) => (
          <ListItem
            key={equipment.serialNumber}
            alignItems="flex-start"
            dense
            button
            onClick={() => handleToggle(equipment)}
          >
            <ListItemAvatar>
              <Avatar variant="rounded" src={equipment.images[0] || undefined} alt={equipment.name}>
                {equipment.name.charAt(0)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2">{equipment.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({equipment.type?.name})
                  </Typography>
                </Stack>
              }
              secondary={
                <>
                  <Typography variant="body2" color="text.secondary">
                    Serial: {equipment.serialNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {equipment.description}
                  </Typography>
                </>
              }
            />
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                checked={itemsSelected.includes(equipment.serialNumber)}
                onChange={() => handleToggle(equipment)}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
