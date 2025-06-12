import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import WebcamScanQRCode from './WebcamScanQRCode';
import ItemScanning from './ItemScanning';
import { onBackStep, onNextStep } from 'src/borrow-equipment-receipt/scan/scan.slice';
import { useDispatch } from 'src/common/redux/store';

type BorrowEquipment = {
  serialNumber: string;
  groupEquipmentCode: string;
  status: string;
};

type RequestItem = {
  groupEquipmentCode: string;
  name: string;
  quantity: number;
  note?: string | null;
  type?: { id: number; name: string; description: string };
  manufacturer?: { id: number; name: string; contactInfo: string; address: string };
};

type Props = {
  borrowEquipments: BorrowEquipment[];
  requestItems: RequestItem[];
};

export default function ScanBorrowReceipt({ borrowEquipments = [], requestItems = [] }: Props) {
  const dispatch = useDispatch();
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  const handleScan = (result: string) => {
    setLastScanned(result);
  };

  // Check if enough equipment has been scanned
  const isEnoughScanned =
    requestItems.length > 0 &&
    requestItems.every((req) => {
      const scanned = borrowEquipments.filter(
        (eq) => eq.groupEquipmentCode === req.groupEquipmentCode
      ).length;
      return scanned >= req.quantity;
    });

  // This callback should be passed from parent to move to next step
  // For now, just a placeholder
  const handleMoveToUpload = () => {
    dispatch(onNextStep());
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Quét thiết bị mượn bằng QR Code
      </Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <WebcamScanQRCode onScan={handleScan} disabled={isEnoughScanned} />
        {lastScanned && (
          <Typography sx={{ mt: 2 }} color="primary">
            Đã quét: <b>{lastScanned}</b>
          </Typography>
        )}
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} spacing={2}>
          <Button color="inherit" onClick={() => dispatch(onBackStep())}>
            Quay lại
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!isEnoughScanned}
            onClick={handleMoveToUpload}
          >
            Tiếp tục
          </Button>
        </Stack>
        {!isEnoughScanned && (
          <Typography color="error" sx={{ mt: 2 }}>
            Bạn chưa quét đủ số lượng thiết bị yêu cầu cho từng nhóm. Vui lòng tiếp tục quét.
          </Typography>
        )}
      </Paper>
      <ItemScanning borrowEquipments={borrowEquipments} requestItems={requestItems} />
    </Box>
  );
}
