import React, { useRef, useCallback, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import axiosInstance from 'src/common/utils/axios';
import { API_BORROW_RECEIPT } from 'src/common/constant/api.constant';
import { useParams } from 'react-router-dom';
import Iconify from 'src/common/components/Iconify';
import { default as useMessage } from 'src/common/hooks/useMessage';
import { useDispatch } from 'src/common/redux/store';
import { triggerRefetch } from 'src/borrow-equipment-receipt/scan/scan.slice';

type Props = {
  onScan: (result: string) => void;
  onError?: (error: string) => void;
};

const videoConstraints = {
  facingMode: 'environment',
};

export default function WebcamScanQRCode({ onScan, onError }: Props) {
  const dispatch = useDispatch();
  const webcamRef = useRef<Webcam>(null);
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingExport, setLoadingExport] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { showErrorSnackbar, showSuccessSnackbar } = useMessage();

  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    // Convert base64 to ImageData
    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        setScanning(false);
        handleScanSuccess(code.data);
      }
    };
    // eslint-disable-next-line
  }, [id]);

  const handleScanSuccess = async (serialNumber: string) => {
    setLoadingExport(true);
    setError(null);
    try {
      if (!id) throw new Error('Không tìm thấy mã phiếu mượn');
      await axiosInstance.post(`${API_BORROW_RECEIPT}/scan-export`, {
        borrowReceiptId: Number(id),
        serialNumber,
      });
      onScan(serialNumber);
      dispatch(triggerRefetch());
      showSuccessSnackbar('Xuất thiết bị thành công!');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Có lỗi xảy ra khi xuất thiết bị';
      setError(msg);
      setScanning(true);
      showErrorSnackbar(msg);
    } finally {
      setLoadingExport(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (scanning) {
      interval = setInterval(() => {
        capture();
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [capture, scanning]);

  const handleRetry = () => {
    setScanning(true);
    setError(null);
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      {scanning ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            videoConstraints={videoConstraints}
            style={{ width: '100%', maxWidth: 400, margin: 'auto', borderRadius: 8 }}
          />
          <Typography sx={{ mt: 2 }}>Đưa mã QR vào vùng quét</Typography>
          <CircularProgress sx={{ mt: 2 }} />
        </>
      ) : loadingExport ? (
        <Box>
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            Đang xuất thiết bị...
          </Typography>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Iconify icon="eva:checkmark-circle-2-fill" color="#2ecc40" width={48} height={48} />
          <Typography variant="h6" color="success.main" sx={{ mb: 2, mt: 1 }}>
            Đã quét thành công!
          </Typography>
          <Button variant="contained" onClick={handleRetry}>
            Quét lại
          </Button>
        </Box>
      )}
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
