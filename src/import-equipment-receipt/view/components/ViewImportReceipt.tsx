import {
  Card,
  Grid,
  Stack,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { RHFEditor } from 'src/common/components/hook-form';
import { IImportReceipt } from 'src/common/@types/import-receipt/import-receipt.interface';
import {
  EQUIPMENT_STATUS_COLOR,
  IMPORT_RECEIPT_STATUS_COLOR,
} from 'src/import-equipment-receipt/common/importReceipt.constant';

type Equipment = {
  serialNumber: string;
  description?: string;
  status: string;
  groupCode: string;
  groupName: string;
  roomName?: string | null;
};

type ViewImportReceiptProps = {
  importReceipt: IImportReceipt & {
    equipments?: Equipment[];
  };
};

const ViewImportReceipt = ({ importReceipt }: ViewImportReceiptProps) => {
  if (!importReceipt) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography color="error" variant="h6">
              Không tìm thấy thông tin phiếu nhập hoặc đã xảy ra lỗi.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    );
  }

  const {
    id,
    name,
    dateOfOrder,
    dateOfReceived,
    dateOfActualReceived,
    status,
    note,
    supplier,
    items,
    equipments,
  } = importReceipt;

  const totalAmount = items?.reduce(
    (sum, item) =>
      sum +
      (typeof item.price === 'string' ? Number(item.price) : item.price || 0) *
        (Number(item.quantity) || 0),
    0
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Thông tin phiếu nhập
          </Typography>
          <Stack spacing={2}>
            <Typography>
              <b>Tên phiếu nhập:</b> {typeof name !== 'undefined' ? name || '-' : '-'}
            </Typography>
            <Typography>
              <b>Ngày nhận hàng dự kiến:</b>{' '}
              {dateOfReceived ? new Date(dateOfReceived).toLocaleDateString() : '-'}
            </Typography>
            {dateOfActualReceived && (
              <Typography>
                <b>Ngày nhận thực tế:</b> {new Date(dateOfActualReceived).toLocaleDateString()}
              </Typography>
            )}
            <Typography>
              <b>Trạng thái:</b>{' '}
              <Chip
                label={status}
                color={IMPORT_RECEIPT_STATUS_COLOR[status] || 'default'}
                size="small"
                sx={{ textTransform: 'capitalize' }}
              />
            </Typography>
            <Typography>
              <b>Ghi chú:</b>
            </Typography>
            {note ? (
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {note}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                -
              </Typography>
            )}
          </Stack>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Nhà cung cấp
          </Typography>
          <Stack spacing={1}>
            <Typography>
              <b>Tên:</b> {supplier?.name}
            </Typography>
            <Typography>
              <b>Địa chỉ:</b> {supplier?.address || '-'}
            </Typography>
            <Typography>
              <b>Số điện thoại:</b> {supplier?.phone || '-'}
            </Typography>
            <Typography>
              <b>Email:</b> {supplier?.email || '-'}
            </Typography>
          </Stack>
        </Card>
        <Card sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Tổng tiền
          </Typography>
          <Typography color="primary" variant="h5">
            {totalAmount.toLocaleString('vi-VN')} ₫
          </Typography>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Danh sách thiết bị
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Code</b>
                  </TableCell>
                  <TableCell>
                    <b>Tên</b>
                  </TableCell>
                  <TableCell align="right">
                    <b>Giá</b>
                  </TableCell>
                  <TableCell align="right">
                    <b>Số lượng</b>
                  </TableCell>
                  <TableCell align="right">
                    <b>Thành tiền</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.name || '-'}</TableCell>
                    <TableCell align="right">
                      {Number(item.price).toLocaleString('vi-VN')} ₫
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      {(Number(item.price) * Number(item.quantity)).toLocaleString('vi-VN')} ₫
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
      {status === 'received' && equipments && equipments.length > 0 && (
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Danh sách thiết bị đã nhập
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Serial</b>
                    </TableCell>
                    <TableCell>
                      <b>Nhóm</b>
                    </TableCell>
                    <TableCell>
                      <b>Trạng thái</b>
                    </TableCell>
                    <TableCell>
                      <b>Phòng</b>
                    </TableCell>
                    <TableCell>
                      <b>Mô tả</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {equipments.map((eq, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{eq.serialNumber}</TableCell>
                      <TableCell>
                        {eq.groupName} ({eq.groupCode})
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={eq.status}
                          color={EQUIPMENT_STATUS_COLOR[eq.status] || 'default'}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>{eq.roomName || '-'}</TableCell>
                      <TableCell>{eq.description || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default ViewImportReceipt;
