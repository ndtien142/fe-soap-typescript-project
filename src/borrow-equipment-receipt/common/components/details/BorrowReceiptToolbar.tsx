import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import {
  Box,
  Stack,
  Dialog,
  Tooltip,
  IconButton,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import useToggle from 'src/common/hooks/useToggle';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import Iconify from 'src/common/components/Iconify';
import BorrowReceiptPDF from './BorrowReceiptPDF';
import { useApproveBorrow } from '../../hooks/useApproveBorrow';
import { default as useMessage } from 'src/common/hooks/useMessage';

// ----------------------------------------------------------------------

type Props = {
  borrowReceipt: any;
};

export default function BorrowReceiptToolbar({ borrowReceipt }: Props) {
  const navigate = useNavigate();
  const { toggle: open, onOpen, onClose } = useToggle();

  const { showErrorSnackbar, showSuccessSnackbar } = useMessage();

  // Approve/reject state
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  const { approveOrReject } = useApproveBorrow({
    onSuccess: () => {
      setLoadingApprove(false);
      setLoadingReject(false);
      showSuccessSnackbar('Cập nhật phiếu mượn thành công!');
      window.location.reload();
    },
    onError: (message) => {
      setLoadingApprove(false);
      setLoadingReject(false);
      // Try to extract message from HTML error response
      let errorMessage = 'Có lỗi xảy ra!';
      console.log(message);
      if (message) {
        const html = message;
        const match = html.match(/<pre>([\s\S]*?)<\/pre>/);
        if (match && match[1]) {
          // Remove HTML tags and decode entities if needed
          errorMessage = match[1].replace(/<br\s*\/?>/gi, '\n').replace(/&nbsp;/g, ' ');
        }
      }
      showErrorSnackbar(errorMessage);
    },
  });

  const handleEdit = () => {
    navigate(PATH_DASHBOARD.borrowReceipt.edit(String(borrowReceipt.id)));
  };

  const handleApprove = () => {
    setLoadingApprove(true);
    approveOrReject(borrowReceipt.id, 'approve', 'Đồng ý duyệt phiếu mượn');
  };

  const handleReject = () => {
    setLoadingReject(true);
    approveOrReject(borrowReceipt.id, 'reject', 'Từ chối duyệt phiếu mượn');
  };

  // Only show approve/reject in "requested" status
  const showApproveReject = borrowReceipt.status === 'requested';

  // Show "Processing" button in "approved" status
  const showProcessing = borrowReceipt.status === 'approved';

  const handleProcessing = () => {
    // Navigate to scan equipment page, e.g. /dashboard/borrow-receipt/{id}/scan
    navigate(PATH_DASHBOARD.borrowReceipt.scan(String(borrowReceipt.id)));
  };

  return (
    <>
      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit">
            <IconButton onClick={handleEdit}>
              <Iconify icon={'eva:edit-fill'} />
            </IconButton>
          </Tooltip>

          <Tooltip title="View">
            <IconButton onClick={onOpen}>
              <Iconify icon={'eva:eye-fill'} />
            </IconButton>
          </Tooltip>

          <PDFDownloadLink
            document={<BorrowReceiptPDF borrowReceipt={borrowReceipt} />}
            fileName={`borrow-receipt-${borrowReceipt.id}`}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <Tooltip title="Download">
                <IconButton>
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <Iconify icon={'eva:download-fill'} />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </PDFDownloadLink>

          <Tooltip title="Print">
            <IconButton>
              <Iconify icon={'eva:printer-fill'} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Send">
            <IconButton>
              <Iconify icon={'ic:round-send'} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Share">
            <IconButton>
              <Iconify icon={'eva:share-fill'} />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Actions based on status */}
        {showApproveReject && (
          <Stack direction="row" spacing={2}>
            <LoadingButton
              variant="contained"
              color="success"
              loading={loadingApprove}
              onClick={handleApprove}
            >
              Duyệt phiếu mượn
            </LoadingButton>
            <LoadingButton
              variant="contained"
              color="error"
              loading={loadingReject}
              onClick={handleReject}
            >
              Từ chối phiếu mượn
            </LoadingButton>
          </Stack>
        )}
        {showProcessing && (
          <Stack direction="row" spacing={2}>
            <LoadingButton variant="contained" color="primary" onClick={handleProcessing}>
              Xuất thiết bị (Quét thiết bị)
            </LoadingButton>
          </Stack>
        )}
        {/* No actions in borrowed status */}
      </Stack>

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
    </>
  );
}
