import React from 'react';
import { Card, Stack, Typography, Divider, Box } from '@mui/material';
import { IEquipmentGroupDetail } from 'src/common/@types/equipment/equipment.interface';

// ----------------------------------------------------------------------

type DetailEquipmentGroupProps = {
  data?: IEquipmentGroupDetail | null;
  isLoading?: boolean;
};

const DetailEquipmentGroup = ({ data, isLoading }: DetailEquipmentGroupProps) => {
  if (isLoading) {
    return <Typography>Đang tải chi tiết nhóm thiết bị...</Typography>;
  }

  if (!data) {
    return <Typography>Không tìm thấy thông tin nhóm thiết bị.</Typography>;
  }

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {data.name}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle2">Mã nhóm thiết bị:</Typography>
          <Typography>{data.code}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Mô tả:</Typography>
          <Typography>{data.description || 'Không có'}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Đơn vị tính:</Typography>
          <Typography>{data.unitOfMeasure?.name || '-'}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Loại thiết bị:</Typography>
          <Typography>{data.type?.name || '-'}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Nhà sản xuất:</Typography>
          <Typography>{data.manufacturer?.name || '-'}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Trạng thái:</Typography>
          <Typography>
            {data.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
            {data.isDeleted ? ' (Đã xóa)' : ''}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
};

export default DetailEquipmentGroup;
