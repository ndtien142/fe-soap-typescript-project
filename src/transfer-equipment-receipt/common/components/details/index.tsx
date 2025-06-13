import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer,
  CircularProgress,
} from '@mui/material';
// utils
import { fDate } from '../../../../common/utils/formatTime';
// @types
// components
import Label from '../../../../common/components/Label';
import Image from '../../../../common/components/Image';
import Scrollbar from '../../../../common/components/Scrollbar';
import TransferToolbar from './TransferToolbar';
// hooks
import { useGetDetailTransferReceipt } from '../../hooks/useGetDetailTransferReceipt';

// ----------------------------------------------------------------------

export default function TransferDetails() {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const { data: transfer, isLoading, fetchDetail } = useGetDetailTransferReceipt();

  useEffect(() => {
    if (id) fetchDetail(id);
  }, [id]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!transfer) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <Typography>Không tìm thấy phiếu điều chuyển</Typography>
      </Box>
    );
  }

  const {
    items = [],
    status,
    transferDate,
    transferTo,
    transferFrom,
    createdBy,
    responsibleBy,
    approveBy,
    id: transferId,
    notes,
  } = transfer;

  return (
    <>
      <TransferToolbar transfer={transfer} />

      <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Image
              disabledEffect
              visibleByDefault
              alt="logo"
              src="/logo/logo_full.svg"
              sx={{ maxWidth: 120 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Box sx={{ textAlign: { sm: 'right' } }}>
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={
                  (status === 'approved' && 'success') ||
                  (status === 'requested' && 'info') ||
                  (status === 'rejected' && 'error') ||
                  (status === 'transferred' && 'warning') ||
                  'default'
                }
                sx={{ textTransform: 'uppercase', mb: 1 }}
              >
                {status}
              </Label>
              <Typography variant="h6">{`ID-${transferId}`}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Transfer from
            </Typography>
            <Typography variant="body2">{transferFrom?.name}</Typography>
            <Typography variant="body2">ID: {transferFrom?.id}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Transfer to
            </Typography>
            <Typography variant="body2">{transferTo?.name}</Typography>
            <Typography variant="body2">ID: {transferTo?.id}</Typography>
          </Grid>

          <Grid item xs={12} sm={3} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Ngày chuyển
            </Typography>
            <Typography variant="body2">{fDate(transferDate)}</Typography>
          </Grid>

          <Grid item xs={12} sm={3} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Người tạo
            </Typography>
            <Typography variant="body2">{createdBy?.username}</Typography>
          </Grid>
          <Grid item xs={12} sm={3} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Người chịu trách nhiệm
            </Typography>
            <Typography variant="body2">{responsibleBy?.username}</Typography>
          </Grid>
          <Grid item xs={12} sm={3} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Người duyệt
            </Typography>
            <Typography variant="body2">{approveBy?.username}</Typography>
          </Grid>
        </Grid>

        {items && items.length > 0 && (
          <Scrollbar>
            <TableContainer sx={{ minWidth: 600 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell align="left">Tên thiết bị</TableCell>
                    <TableCell align="left">Serial</TableCell>
                    <TableCell align="left">Loại thiết bị</TableCell>
                    <TableCell align="left">Mô tả</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, idx) => (
                    <TableRow key={item.serialNumber}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell align="left">{item.type?.name}</TableCell>
                      <TableCell align="left">{item.serialNumber}</TableCell>
                      <TableCell align="left">{item.type?.name}</TableCell>
                      <TableCell align="left">{item.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        )}

        <Divider sx={{ mt: 5 }} />

        <Grid container>
          <Grid item xs={12} md={9} sx={{ py: 3 }}>
            <Typography variant="subtitle2">GHI CHÚ</Typography>
            <Typography variant="body2">
              <span dangerouslySetInnerHTML={{ __html: notes || '' }} />
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
