// @mui
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
// utils
import { fDate } from 'src/common/utils/formatTime';
import { fCurrency } from 'src/common/utils/formatNumber';
// _mock_
// components
import ImportReceiptToolbar from './ImportReceiptToolbar';
//
import Label from 'src/common/components/Label';
import Scrollbar from 'src/common/components/Scrollbar';
import Image from 'src/common/components/Image';
import { Invoice } from 'src/common/@types/invoice';

// ----------------------------------------------------------------------

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  importReceipt?: any;
};

export default function ImportReceiptDetail({ importReceipt }: Props) {
  const theme = useTheme();

  if (!importReceipt) {
    return null;
  }

  const {
    name,
    items,
    status,
    dateOfOrder,
    dateOfReceived,
    dateOfActualReceived,
    note,
    supplier,
    requestedUser,
    approvedBy,
    equipments,
  } = importReceipt;

  // Calculate subtotal and total
  const subTotalPrice = items?.reduce(
    (sum: number, item: any) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );
  // No discount/taxes in this API, so total = subtotal
  const totalPrice = subTotalPrice;

  return (
    <>
      <ImportReceiptToolbar importReceipt={importReceipt} />
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
                  (status === 'received' && 'success') ||
                  (status === 'approved' && 'info') ||
                  (status === 'pending' && 'warning') ||
                  (status === 'rejected' && 'error') ||
                  'default'
                }
                sx={{ textTransform: 'uppercase', mb: 1 }}
              >
                {status}
              </Label>
              <Typography variant="h6">{name || `Phiếu nhập #${importReceipt.id}`}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Nhà cung cấp
            </Typography>
            <Typography variant="body2">{supplier?.name}</Typography>
            <Typography variant="body2">{supplier?.address}</Typography>
            <Typography variant="body2">Phone: {supplier?.phone}</Typography>
            <Typography variant="body2">Email: {supplier?.email}</Typography>
          </Grid>

          <Grid item xs={12} sm={3} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Ngày đặt hàng
            </Typography>
            <Typography variant="body2">{dateOfOrder && fDate(dateOfOrder)}</Typography>
          </Grid>

          <Grid item xs={12} sm={3} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Ngày nhận hàng dự kiến
            </Typography>
            <Typography variant="body2">{dateOfReceived && fDate(dateOfReceived)}</Typography>
          </Grid>

          <Grid item xs={12} sm={3} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Ngày nhận hàng thực tế
            </Typography>
            <Typography variant="body2">
              {dateOfActualReceived && fDate(dateOfActualReceived)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={3} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Người yêu cầu
            </Typography>
            <Typography variant="body2">{requestedUser?.username}</Typography>
          </Grid>

          <Grid item xs={12} sm={3} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Người duyệt
            </Typography>
            <Typography variant="body2">{approvedBy?.username}</Typography>
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
                  <TableCell align="left">Mã thiết bị</TableCell>
                  <TableCell align="left">Tên thiết bị</TableCell>
                  <TableCell align="left">Số lượng</TableCell>
                  <TableCell align="right">Đơn giá</TableCell>
                  <TableCell align="right">Thành tiền</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.map((row: any, index: number) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell align="left">{row.code}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.quantity}</TableCell>
                    <TableCell align="right">{fCurrency(row.price)}</TableCell>
                    <TableCell align="right">
                      {fCurrency((Number(row.price) || 0) * (Number(row.quantity) || 0))}
                    </TableCell>
                  </TableRow>
                ))}

                <RowResultStyle>
                  <TableCell colSpan={4} />
                  <TableCell align="right">
                    <Box sx={{ mt: 2 }} />
                    <Typography>Tạm tính</Typography>
                  </TableCell>
                  <TableCell align="right" width={120}>
                    <Box sx={{ mt: 2 }} />
                    <Typography>{fCurrency(subTotalPrice)}</Typography>
                  </TableCell>
                </RowResultStyle>

                <RowResultStyle>
                  <TableCell colSpan={4} />
                  <TableCell align="right">
                    <Typography variant="h6">Tổng cộng</Typography>
                  </TableCell>
                  <TableCell align="right" width={140}>
                    <Typography variant="h6">{fCurrency(totalPrice)}</Typography>
                  </TableCell>
                </RowResultStyle>
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {/* Equipments Table */}
        {equipments && equipments.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 5, mb: 2 }}>
              Danh sách thiết bị nhập kho
            </Typography>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Serial Number</TableCell>
                      <TableCell>Nhóm thiết bị</TableCell>
                      <TableCell>Tên nhóm</TableCell>
                      <TableCell>Phòng</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Mô tả</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {equipments.map((eq: any, idx: number) => (
                      <TableRow key={eq.serialNumber}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{eq.serialNumber}</TableCell>
                        <TableCell>{eq.groupCode}</TableCell>
                        <TableCell>{eq.groupName}</TableCell>
                        <TableCell>{eq.roomName || '-'}</TableCell>
                        <TableCell>
                          <Label
                            color={
                              eq.status === 'available'
                                ? 'success'
                                : eq.status === 'in_use'
                                ? 'warning'
                                : 'default'
                            }
                          >
                            {eq.status}
                          </Label>
                        </TableCell>
                        <TableCell>{eq.description}</TableCell>
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
          <Grid item xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
            <Typography variant="subtitle2">Liên hệ hỗ trợ</Typography>
            <Typography variant="body2">{supplier?.email || 'support@minimals.cc'}</Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
