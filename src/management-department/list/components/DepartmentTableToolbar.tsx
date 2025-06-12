import React from 'react';
import { Stack, InputAdornment, TextField, MenuItem } from '@mui/material';
import Iconify from 'src/common/components/Iconify';

type Props = {
  filterName: string;  // filterName là chuỗi
  onFilterName: (value: string) => void;  // onFilterName là hàm xử lý thay đổi filterName
};

const DepartmentTableToolbar = ({
  filterName,
  onFilterName,
}: Props) => {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      {/* Bộ lọc theo tên phòng ban */}
      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}  // Cập nhật filterName
        placeholder="Search department..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon={'eva:search-fill'}
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
};

export default DepartmentTableToolbar;
