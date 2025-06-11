import React, { useState } from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import WebcamScanQRCode from './WebcamScanQRCode';
import ItemScanning from './ItemScanning';

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
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  const handleScan = (result: string) => {
    setLastScanned(result);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Quét thiết bị mượn bằng QR Code
      </Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <WebcamScanQRCode onScan={handleScan} />
        {lastScanned && (
          <Typography sx={{ mt: 2 }} color="primary">
            Đã quét: <b>{lastScanned}</b>
          </Typography>
        )}
      </Paper>
      <ItemScanning borrowEquipments={borrowEquipments} requestItems={requestItems} />
    </Box>
  );
}
