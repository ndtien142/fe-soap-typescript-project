import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, TableCell, Typography, MenuItem, Chip } from '@mui/material';
import { TableMoreMenu } from 'src/common/components/table';
import Iconify from 'src/common/components/Iconify';
import { IImportReceipt } from 'src/common/@types/import-receipt/import-receipt.interface';
import { IMPORT_RECEIPT_STATUS_COLOR } from 'src/import-equipment-receipt/common/importReceipt.constant';
// types

type Props = {
  row: IImportReceipt;
  onViewRow: VoidFunction;
  onEditRow: VoidFunction;
};

export default function ImportReceiptRow({ row, onViewRow, onEditRow }: Props) {
  const theme = useTheme();

  const {
    id,
    dateOfOrder,
    dateOfReceived,
    dateOfActualReceived,
    status,
    note,
    supplier,
    requestedUser,
    items,
  } = row;

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
          {`PN-${id}`}
        </Typography>
      </TableCell>

      <TableCell align="left">{new Date(dateOfOrder).toLocaleDateString('vi-VN')}</TableCell>

      <TableCell align="left">{new Date(dateOfReceived).toLocaleDateString('vi-VN')}</TableCell>

      <TableCell align="left">
        {dateOfActualReceived
          ? new Date(dateOfActualReceived).toLocaleDateString('vi-VN')
          : 'Chưa nhận'}
      </TableCell>

      <TableCell align="left">
        <Chip
          label={status}
          color={IMPORT_RECEIPT_STATUS_COLOR[status] || 'default'}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      </TableCell>

      <TableCell align="left">{note}</TableCell>

      <TableCell align="left">{supplier?.name}</TableCell>

      <TableCell align="left">{requestedUser?.username}</TableCell>

      {/* <TableCell align="center">{items?.length}</TableCell> */}

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
