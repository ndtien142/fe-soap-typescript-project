import { useState } from 'react';
// @mui
import { TableRow, TableCell, Chip, MenuItem } from '@mui/material';
// components
import Iconify from 'src/common/components/Iconify';
import { TableMoreMenu } from 'src/common/components/table';
import { ITransferReceipts } from 'src/common/@types/transfer-receipt/transfer-receipt.interface';

// ----------------------------------------------------------------------

const statusColorMap: Record<string, 'default' | 'info' | 'success' | 'error' | 'warning'> = {
  requested: 'info',
  approved: 'success',
  rejected: 'error',
  transferred: 'warning',
};

type Props = {
  row: ITransferReceipts;
  onEditRow: (row: ITransferReceipts) => void;
  onViewRow: (row: ITransferReceipts) => void;
};

export default function TransferTableRow({ row, onEditRow, onViewRow }: Props) {
  const [openMenu, setOpenMenu] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  return (
    <TableRow hover>
      <TableCell align="left">
        {row.transferFrom?.name}
        <br />
        <small style={{ color: '#888' }}>{row.transferFrom?.id}</small>
      </TableCell>
      <TableCell align="left">
        {row.transferTo?.name}
        <br />
        <small style={{ color: '#888' }}>{row.transferTo?.id}</small>
      </TableCell>
      <TableCell align="left">
        {row.transferDate ? new Date(row.transferDate).toLocaleDateString() : ''}
      </TableCell>
      <TableCell align="left">{row.responsibleBy?.username}</TableCell>
      <TableCell align="left">{row.createdBy?.username}</TableCell>
      <TableCell align="left">
        <Chip
          label={row.status}
          color={statusColorMap[row.status] || 'default'}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      </TableCell>
      <TableCell align="left">
        <span dangerouslySetInnerHTML={{ __html: row.notes || '' }} />
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
                  onViewRow(row);
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:eye-fill'} />
                Xem
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onEditRow(row);
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Chỉnh sửa
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
