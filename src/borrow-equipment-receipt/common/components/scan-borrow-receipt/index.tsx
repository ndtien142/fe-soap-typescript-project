import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  DialogActions,
  Tooltip,
  Dialog,
  IconButton,
} from '@mui/material';
import WebcamScanQRCode from './WebcamScanQRCode';
import ItemScanning from './ItemScanning';
import { onBackStep, onNextStep } from 'src/borrow-equipment-receipt/scan/scan.slice';
import { useDispatch } from 'src/common/redux/store';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import BorrowReceiptPDF from '../details/BorrowReceiptPDF';
import Iconify from 'src/common/components/Iconify';
import { IBorrowReceiptDetail } from 'src/common/@types/borrow-receipt/borrowReceipt.interface';
import useToggle from 'src/common/hooks/useToggle';

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
  borrowReceipt: IBorrowReceiptDetail;
};

export default function ScanBorrowReceipt({
  borrowEquipments = [],
  requestItems = [],
  borrowReceipt: borrowReceiptDetail,
}: Props) {
  const dispatch = useDispatch();
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  const { toggle: open, onOpen, onClose } = useToggle();

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

  // Example borrowReceipt object for PDF (replace with real data as needed)
  const borrowReceipt = {
    borrowEquipments,
    requestItems,
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
          {isEnoughScanned && (
            <Stack direction="row" spacing={1}>
              <PDFDownloadLink
                document={<BorrowReceiptPDF borrowReceipt={borrowReceiptDetail} />}
                fileName={`borrow-receipt-${borrowReceiptDetail?.id}`}
                style={{ textDecoration: 'none' }}
              >
                <Tooltip title="Download">
                  <IconButton>
                    <Iconify icon={'eva:download-fill'} />
                  </IconButton>
                </Tooltip>
              </PDFDownloadLink>
              <Tooltip title="View">
                <IconButton onClick={onOpen}>
                  <Iconify icon={'eva:eye-fill'} />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
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
      <Dialog fullScreen open={open}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              zIndex: 9,
              padding: '12px !important',
              boxShadow: (theme) => theme.customShadows.z8,
            }}
          >
            <Tooltip title="Close">
              <IconButton color="inherit" onClick={onClose}>
                <Iconify icon={'eva:close-fill'} />
              </IconButton>
            </Tooltip>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <BorrowReceiptPDF borrowReceipt={borrowReceipt} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
