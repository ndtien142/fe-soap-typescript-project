import { Box, Typography, Button, Stack } from '@mui/material';
import Iconify from 'src/common/components/Iconify';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from 'src/common/routes/paths';

export default function BorrowedSuccess() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(PATH_DASHBOARD.borrowReceipt.list);
  };

  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Iconify icon="eva:checkmark-circle-2-fill" color="#2ecc40" width={96} height={96} />
      <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
        Hoàn tất phiếu mượn thiết bị!
      </Typography>
      <Typography sx={{ mb: 4 }}>
        Bạn đã xác nhận và hoàn tất quá trình mượn thiết bị thành công.
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="contained" color="primary" onClick={handleGoBack}>
          Quay về danh sách phiếu mượn
        </Button>
      </Stack>
    </Box>
  );
}
