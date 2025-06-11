import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  TablePagination,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IEquipmentGroupDetail } from 'src/common/@types/equipment/equipment.interface';
import Iconify from 'src/common/components/Iconify';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import Label from 'src/common/components/Label';
import { QRCodeCanvas } from 'qrcode.react';

type Props = {
  data?: IEquipmentGroupDetail | null;
  isLoading?: boolean;
};

export default function SerialNumberEquipmentList({ data, isLoading }: Props) {
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (isLoading) {
    return <CircularProgress />;
  }

  const serials = data?.equipments || [];

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNavigateDetail = (serialNumber: string) => {
    if (id && serialNumber) {
      navigate(PATH_DASHBOARD.equipment?.serialItem(id, serialNumber));
    }
  };

  // Map status to color and label

  type LabelColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default';

  const getStatusProps = (status: string): { color: LabelColor; label: string } => {
    switch (status) {
      case 'available':
        return { color: 'success', label: 'Sẵn sàng' };
      case 'in_use':
        return { color: 'info', label: 'Đang sử dụng' };
      case 'under_maintenance':
        return { color: 'warning', label: 'Bảo trì' };
      case 'out_of_service':
        return { color: 'error', label: 'Ngừng hoạt động' };
      case 'liquidation':
        return { color: 'default', label: 'Thanh lý' };
      case 'reserved':
        return { color: 'primary', label: 'Đã đặt trước' };
      case 'pending_transfer':
        return { color: 'secondary', label: 'Chờ chuyển giao' };
      default:
        return { color: 'default', label: status };
    }
  };

  if (!serials.length) {
    return <Typography>Không có số serial nào.</Typography>;
  }

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Danh sách số serial
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Số serial</TableCell>
              <TableCell>QR Code</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Phòng</TableCell>
              <TableCell>Khoa</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày sử dụng đầu tiên</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {serials.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => {
              const { color, label } = getStatusProps(item.status);
              return (
                <TableRow key={item.serialNumber}>
                  <TableCell>{item.serialNumber}</TableCell>
                  <TableCell>
                    <QRCodeCanvas value={item.serialNumber} size={48} />
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.room && item.room.name ? item.room.name : '-'}</TableCell>
                  <TableCell>
                    {item.room && item.room.department && item.room.department.name
                      ? item.room.department.name
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Label color={color} sx={{ textTransform: 'capitalize' }}>
                      {label}
                    </Label>
                  </TableCell>
                  <TableCell>
                    {item.dayOfFirstUse
                      ? new Date(item.dayOfFirstUse).toLocaleDateString('vi-VN')
                      : '-'}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        color="primary"
                        onClick={() => handleNavigateDetail(item.serialNumber)}
                      >
                        <Iconify icon="eva:eye-outline" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {serials.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có số serial nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ position: 'relative' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={serials.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Card>
  );
}
