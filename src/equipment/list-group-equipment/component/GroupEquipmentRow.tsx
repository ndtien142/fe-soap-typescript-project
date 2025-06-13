import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, Stack, Link, MenuItem } from '@mui/material';
import Label from 'src/common/components/Label';
import { TableMoreMenu } from 'src/common/components/table';
import Iconify from 'src/common/components/Iconify';
import { IGroupEquipment } from '../equipmentGroup.interface';
import { QRCodeCanvas } from 'qrcode.react';
// components

// ----------------------------------------------------------------------

type Props = {
  row: IGroupEquipment;
  onViewRow: VoidFunction;
  onEditRow: VoidFunction;
  // onDeleteRow: VoidFunction;
};

export default function GroupEquipmentRow({
  row,
  onViewRow,
  onEditRow,
}: // onDeleteRow,
Props) {
  const theme = useTheme();

  const { code, name, unitOfMeasure, type, manufacturer, equipmentStatusCounts, isActive } = row;

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  // 👇 Tạo thông tin trạng thái thiết bị (sử dụng nếu có)
  const statusText =
    equipmentStatusCounts && Object.keys(equipmentStatusCounts).length > 0
      ? `Đang dùng: ${equipmentStatusCounts.in_use ?? 0}, Có sẵn: ${
          equipmentStatusCounts.available ?? 0
        }`
      : 'Chưa có';

  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
        <QRCodeCanvas value={code} size={48} style={{ marginTop: 8 }} />
      </TableCell>

      <TableCell align="left">{name}</TableCell>

      <TableCell align="left">{unitOfMeasure?.name}</TableCell>

      <TableCell align="left">{type?.name}</TableCell>

      <TableCell align="left">{manufacturer?.name}</TableCell>

      <TableCell align="left">{statusText}</TableCell>

      <TableCell align="center">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={isActive ? 'success' : 'error'}
        >
          {isActive ? 'Hoạt động' : 'Không hoạt động'}
        </Label>
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onViewRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:eye-fill'} />
                Xem
              </MenuItem>

              <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Sửa
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
