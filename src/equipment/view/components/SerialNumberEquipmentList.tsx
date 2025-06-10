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
} from '@mui/material';
import { useState } from 'react';
import { IEquipmentGroupDetail } from 'src/common/@types/equipment/equipment.interface';

type Props = {
  data?: IEquipmentGroupDetail | null;
  isLoading?: boolean;
};

export default function SerialNumberEquipmentList({ data, isLoading }: Props) {
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  if (isLoading) {
    return <CircularProgress />;
  }

  const serials = data?.equipments || [];

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
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
              <TableCell>Mô tả</TableCell>
              <TableCell>Vị trí</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày sử dụng đầu tiên</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {serials.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
              <TableRow key={item.serialNumber}>
                <TableCell>{item.serialNumber}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.location || '-'}</TableCell>
                <TableCell>
                  {item.status === 'in_use'
                    ? 'Đang sử dụng'
                    : item.status === 'available'
                    ? 'Sẵn sàng'
                    : item.status}
                </TableCell>
                <TableCell>
                  {item.dayOfFirstUse
                    ? new Date(item.dayOfFirstUse).toLocaleDateString('vi-VN')
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
            {serials.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
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
