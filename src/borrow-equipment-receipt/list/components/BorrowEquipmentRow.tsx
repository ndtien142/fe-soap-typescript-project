import { useState } from 'react';
import { TableRow, TableCell, Typography, MenuItem, Chip } from '@mui/material';
import { TableMoreMenu } from 'src/common/components/table';
import Iconify from 'src/common/components/Iconify';
import { IBorrowReceipt } from '../../../common/@types/borrow-receipt/borrowReceipt.interface';
import { BORROW_RECEIPT_STATUS_COLOR } from 'src/borrow-equipment-receipt/common/constant';

interface Props {
  receipt: IBorrowReceipt;
  onEditRow?: () => void;
  onViewRow?: () => void;
}

export default function BorrowEquipmentRow({ receipt, onEditRow, onViewRow }: Props) {
  const { id, createdTime, borrowDate, returnDate, status, note, room, requestedBy, requestItems } =
    receipt;

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {`PM-${id}`}
        </Typography>
      </TableCell>

      <TableCell align="left">{requestedBy?.username}</TableCell>

      <TableCell align="left">{room?.roomName}</TableCell>

      <TableCell align="left">
        <Chip
          label={status}
          color={BORROW_RECEIPT_STATUS_COLOR[status] || 'default'}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      </TableCell>

      <TableCell align="left">
        {createdTime ? new Date(createdTime).toLocaleDateString('vi-VN') : ''}
      </TableCell>

      <TableCell align="left">
        {status === 'borrowed'
          ? borrowDate
            ? new Date(borrowDate).toLocaleDateString('vi-VN')
            : 'đã bàn giao'
          : 'chưa bàn giao'}
      </TableCell>

      <TableCell align="left">
        {requestItems.map((item) => (
          <div key={item.groupEquipmentCode}>
            {item.name} (x{item.quantity})
          </div>
        ))}
      </TableCell>

      <TableCell align="left">{note}</TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onViewRow && onViewRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon="eva:eye-fill" />
                Xem
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onEditRow && onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon="eva:edit-fill" />
                Sửa
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
