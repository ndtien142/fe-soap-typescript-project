import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer,
} from '@mui/material';
import Label from 'src/common/components/Label';
import Scrollbar from 'src/common/components/Scrollbar';
import Image from 'src/common/components/Image';

// ----------------------------------------------------------------------

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

type BorrowReceiptDetailProps = {
  borrowReceipt: {
    id: number;
    userCode: string;
    returnDate: string | null;
    status: string;
    note: string;
    room: {
      roomId: string;
      roomName: string;
      roomStatus: boolean;
      department: {
        departmentId: string;
        departmentName: string;
      };
    };
    requestedBy: {
      userCode: string;
      username: string;
      phone: string | null;
      email: string | null;
    };
    borrowEquipments: {
      serialNumber: string;
      groupEquipmentCode: string;
      status: string;
    }[];
    requestItems: {
      groupEquipmentCode: string;
      name: string;
      quantity: number;
      note: string | null;
      type: {
        id: number;
        name: string;
        description: string;
      };
      manufacturer: {
        id: number;
        name: string;
        contactInfo: string;
        address: string;
      };
    }[];
  };
};

export default function BorrowReceiptDetail({ borrowReceipt }: BorrowReceiptDetailProps) {
  const theme = useTheme();

  if (!borrowReceipt) {
    return null;
  }

  const { id, status, note, room, requestedBy, borrowEquipments, requestItems, returnDate } =
    borrowReceipt;

  return (
    <>
      <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Image
              disabledEffect
              visibleByDefault
              alt="logo"
              src="/logo/logo_full.svg"
              sx={{ maxWidth: 120 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Box sx={{ textAlign: { sm: 'right' } }}>
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={
                  (status === 'borrowed' && 'info') ||
                  (status === 'returned' && 'success') ||
                  (status === 'pending' && 'warning') ||
                  'default'
                }
                sx={{ textTransform: 'uppercase', mb: 1 }}
              >
                {status}
              </Label>
              <Typography variant="h6">{`Phiếu mượn #${id}`}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Phòng mượn
            </Typography>
            <Typography variant="body2">{room?.roomName}</Typography>
            <Typography variant="body2">{room?.department?.departmentName}</Typography>
          </Grid>

          <Grid item xs={12} sm={3} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Ngày trả dự kiến
            </Typography>
            <Typography variant="body2">
              {returnDate ? new Date(returnDate).toLocaleDateString('vi-VN') : '-'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={3} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Người mượn
            </Typography>
            <Typography variant="body2">{requestedBy?.username}</Typography>
          </Grid>
        </Grid>

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <TableHead
                sx={{
                  borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  '& th': { backgroundColor: 'transparent' },
                }}
              >
                <TableRow>
                  <TableCell width={40}>#</TableCell>
                  <TableCell align="left">Mã nhóm thiết bị</TableCell>
                  <TableCell align="left">Tên nhóm</TableCell>
                  <TableCell align="left">Số lượng</TableCell>
                  <TableCell align="left">Loại thiết bị</TableCell>
                  <TableCell align="left">Hãng sản xuất</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {requestItems?.map((row, index) => (
                  <TableRow
                    key={row.groupEquipmentCode}
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell align="left">{row.groupEquipmentCode}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.quantity}</TableCell>
                    <TableCell align="left">{row.type?.name}</TableCell>
                    <TableCell align="left">{row.manufacturer?.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {/* Equipments Table */}
        {borrowEquipments && borrowEquipments.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 5, mb: 2 }}>
              Danh sách thiết bị mượn
            </Typography>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Serial Number</TableCell>
                      <TableCell>Mã nhóm thiết bị</TableCell>
                      <TableCell>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {borrowEquipments.map((eq, idx) => (
                      <TableRow key={eq.serialNumber}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{eq.serialNumber}</TableCell>
                        <TableCell>{eq.groupEquipmentCode}</TableCell>
                        <TableCell>
                          <Label
                            color={
                              eq.status === 'available'
                                ? 'success'
                                : eq.status === 'in_use'
                                ? 'info'
                                : eq.status === 'under_maintenance'
                                ? 'warning'
                                : eq.status === 'out_of_service'
                                ? 'error'
                                : eq.status === 'liquidation'
                                ? 'default'
                                : eq.status === 'reserved'
                                ? 'primary'
                                : eq.status === 'pending_transfer'
                                ? 'secondary'
                                : 'default'
                            }
                          >
                            {eq.status}
                          </Label>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </>
        )}

        <Divider sx={{ mt: 5 }} />

        <Grid container>
          <Grid item xs={12} md={9} sx={{ py: 3 }}>
            <Typography variant="subtitle2">Ghi chú</Typography>
            <Typography variant="body2">{note || 'Không có ghi chú.'}</Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
