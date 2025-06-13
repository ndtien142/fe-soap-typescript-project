import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { default as useMessage } from 'src/common/hooks/useMessage';
// @mui
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
// hooks
import useToggle from 'src/common/hooks/useToggle';
// routes
import { PATH_DASHBOARD } from 'src/common/routes/paths';
// @types
import { IImportReceipt } from 'src/common/@types/import-receipt/import-receipt.interface';
// components
import Iconify from 'src/common/components/Iconify';
import ImportReceiptPDF from './ImportReceiptPDF';
import axiosInstance from 'src/common/utils/axios';
import { API_IMPORT_RECEIPT } from 'src/common/constant/api.constant';

// ----------------------------------------------------------------------

type Props = {
  importReceipt: IImportReceipt;
};

export default function ImportReceiptToolbar({ importReceipt }: Props) {
  const navigate = useNavigate();

  const { toggle: open, onOpen, onClose } = useToggle();

  const { showErrorSnackbar, showSuccessSnackbar } = useMessage();

  // State for status menu
  const [statusLoading, setStatusLoading] = useState(false);

  const handleEdit = () => {
    // Only allow edit if status is 'requested'
    if (importReceipt.status === 'requested') {
      navigate(PATH_DASHBOARD.importReceipt.edit(String(importReceipt.id)));
    }
  };

  // You should implement this function to call your API to update status
  const handleChangeStatus = async (status: string) => {
    setStatusLoading(true);
    try {
      if (status === 'received') {
        await axiosInstance.post(`${API_IMPORT_RECEIPT}/${importReceipt.id}/process`);
      } else {
        await axiosInstance.put(`${API_IMPORT_RECEIPT}/${importReceipt.id}/status`, {
          status,
          reason: '',
        });
      }
      showSuccessSnackbar('Cập nhật trạng thái thành công!');
      window.location.reload();
    } catch (error) {
      showErrorSnackbar('Cập nhật trạng thái thất bại!');
    }
    setStatusLoading(false);
  };

  // Status options logic
  const showApproveReject = importReceipt.status === 'requested';
  const showReceivedOrReturn = importReceipt.status === 'approved';

  const canEdit = importReceipt.status === 'requested';

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
          <Tooltip title={canEdit ? 'Edit' : 'Không thể chỉnh sửa'}>
            <span>
              <IconButton onClick={handleEdit} disabled={!canEdit}>
                <Iconify icon={'eva:edit-fill'} />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="View">
            <IconButton onClick={onOpen}>
              <Iconify icon={'eva:eye-fill'} />
            </IconButton>
          </Tooltip>

          <PDFDownloadLink
            document={<ImportReceiptPDF importReceipt={importReceipt} />}
            fileName={importReceipt.name || String(importReceipt.id)}
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
              loading={statusLoading}
              onClick={() => handleChangeStatus('approved')}
            >
              Duyệt phiếu nhập
            </LoadingButton>
            <LoadingButton
              variant="contained"
              sx={{
                backgroundColor: '#d32f2f',
                color: '#fff',
                '&:hover': { backgroundColor: '#b71c1c' },
              }}
              loading={statusLoading}
              onClick={() => handleChangeStatus('rejected')}
            >
              Từ chối phiếu nhập
            </LoadingButton>
          </Stack>
        )}
        {showReceivedOrReturn && (
          <Stack direction="row" spacing={2}>
            <LoadingButton
              variant="contained"
              color="success"
              loading={statusLoading}
              onClick={() => handleChangeStatus('received')}
            >
              Đã nhận
            </LoadingButton>
            <LoadingButton
              variant="contained"
              color="error"
              loading={statusLoading}
              onClick={() => handleChangeStatus('returned')}
            >
              Hủy phiếu nhập
            </LoadingButton>
          </Stack>
        )}
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
              <ImportReceiptPDF importReceipt={importReceipt} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
