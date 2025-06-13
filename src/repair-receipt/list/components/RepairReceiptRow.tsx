import { useState } from 'react';
import { TableRow, TableCell, Typography, MenuItem, Chip } from '@mui/material';
import { TableMoreMenu } from 'src/common/components/table';
import Iconify from 'src/common/components/Iconify';
import { IRepairReceipt } from 'src/common/@types/repair-receipt/repairReceipt.interface';
import { REPAIR_RECEIPT_STATUS_COLOR } from 'src/repair-receipt/common/constant';

interface Props {
  receipt: IRepairReceipt;
  onEditRow?: () => void;
  onViewRow?: () => void;
}

export default function RepairReceiptRow({ receipt, onEditRow, onViewRow }: Props) {
  const { id, userCode, startDate, endDate, status, note, items } = receipt;

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
          {`PSC-${id}`}
        </Typography>
      </TableCell>

      <TableCell align="left">{userCode}</TableCell>

      <TableCell align="left">
        <Chip
          label={status}
          color={REPAIR_RECEIPT_STATUS_COLOR[status] || 'default'}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      </TableCell>

      <TableCell align="left">
        {startDate && endDate
          ? `${new Date(startDate).toLocaleDateString('vi-VN')} - ${new Date(endDate).toLocaleDateString('vi-VN')}`
          : ''}
      </TableCell>

      <TableCell align="left">
        {items?.map((item, index) => (
          <div key={index}>
            {item.serialNumber} {item.note && `(Ghi chú: ${item.note})`}
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
                  onViewRow?.();
                  handleCloseMenu();
                }}
              >
                <Iconify icon="eva:eye-fill" />
                Xem
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onEditRow?.();
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
