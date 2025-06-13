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
  Box,
} from '@mui/material';
import { useEffect, useState } from 'react';
import axiosInstance from 'src/common/utils/axios';

// Mock data for development/testing
const MOCK_HISTORY: HistoryItem[] = [
  {
    id: '1',
    userCode: 'U001',
    username: 'Nguyen Van A',
    roomName: 'Phòng 101',
    departmentName: 'Khoa CNTT',
    borrowDate: '2024-06-01',
    returnDate: '2024-06-10',
    status: 'Đã trả',
  },
  {
    id: '2',
    userCode: 'U002',
    username: 'Tran Thi B',
    roomName: 'Phòng 102',
    departmentName: 'Khoa Điện',
    borrowDate: '2024-06-11',
    returnDate: null,
    status: 'Đang mượn',
  },
];

type HistoryItem = {
  id: string;
  userCode: string;
  username?: string;
  roomName?: string;
  departmentName?: string;
  borrowDate: string;
  returnDate: string | null;
  status: string;
};

type Props = {
  serialNumber: string;
};

export default function HistoryOfUsingSerialEquipment({ serialNumber }: Props) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setHistory(MOCK_HISTORY); // Use mock data if no serialNumber
  }, [serialNumber]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    // <Card sx={{ p: 2, mt: 3 }}>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mã người mượn</TableCell>
            <TableCell>Tên người mượn</TableCell>
            <TableCell>Phòng</TableCell>
            <TableCell>Khoa</TableCell>
            <TableCell>Ngày mượn</TableCell>
            <TableCell>Ngày trả</TableCell>
            <TableCell>Trạng thái</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                Không có lịch sử sử dụng.
              </TableCell>
            </TableRow>
          ) : (
            history.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.userCode}</TableCell>
                <TableCell>{item.username || '-'}</TableCell>
                <TableCell>{item.roomName || '-'}</TableCell>
                <TableCell>{item.departmentName || '-'}</TableCell>
                <TableCell>
                  {item.borrowDate ? new Date(item.borrowDate).toLocaleDateString('vi-VN') : '-'}
                </TableCell>
                <TableCell>
                  {item.returnDate ? new Date(item.returnDate).toLocaleDateString('vi-VN') : '-'}
                </TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
    // </Card>
  );
}
