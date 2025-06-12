import React from 'react';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import { IAvailableGroupEquipment } from 'src/common/@types/borrow-receipt/borrowReceipt.interface';

type Props = {
  data: IAvailableGroupEquipment[];
  allAvailable: boolean;
  onProcess: () => void;
  isLoading?: boolean;
};

export default function AvailableEquipmentCheck({
  data,
  allAvailable,
  onProcess,
  isLoading,
}: Props) {
  console.log('AvailableEquipmentCheck data: ', data);
  return (
    <Stack spacing={2}>
      <Card sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Kiểm tra thiết bị sẵn sàng
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã nhóm</TableCell>
                <TableCell>Tên nhóm</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Hãng</TableCell>
                <TableCell>Yêu cầu</TableCell>
                <TableCell>Có sẵn</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.groupEquipmentCode}>
                  <TableCell>{row.groupEquipmentCode}</TableCell>
                  <TableCell>{row.groupEquipmentName}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        maxWidth: 240,
                        whiteSpace: 'pre-line',
                        wordBreak: 'break-word',
                      }}
                      dangerouslySetInnerHTML={{ __html: row.groupEquipmentDescription }}
                    />
                  </TableCell>
                  <TableCell>{row.equipmentType?.name}</TableCell>
                  <TableCell>{row.equipmentManufacturer?.name}</TableCell>
                  <TableCell>{row.requested}</TableCell>
                  <TableCell>{row.availableCount}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.available ? 'Đủ thiết bị' : 'Không đủ'}
                      color={row.available ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Không có dữ liệu.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          disabled={!allAvailable || isLoading}
          onClick={onProcess}
        >
          Tiến hành xuất thiết bị
        </Button>
      </Stack>
    </Stack>
  );
}
