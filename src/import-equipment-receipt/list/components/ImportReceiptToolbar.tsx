import { InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import React from 'react';
import Iconify from 'src/common/components/Iconify';

const INPUT_WIDTH = 160;

type Option = {
  value: string | number;
  label: string;
};

type Props = {
  optionsSupplier: Option[];
  optionsStatus: Option[];
  filterSupplier: string;
  filterStatus: string;
  filterCode: string;
  onFilterSupplier: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterStatus: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterCode: (value: string) => void;
};

export default function ImportReceiptToolbar({
  optionsSupplier,
  optionsStatus,
  filterSupplier,
  filterStatus,
  filterCode,
  onFilterSupplier,
  onFilterStatus,
  onFilterCode,
}: Props) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 3 }}>
      {/* Bộ lọc Nhà cung cấp */}
      <TextField
        fullWidth
        select
        label="Nhà cung cấp"
        value={filterSupplier}
        onChange={onFilterSupplier}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } },
          },
        }}
        sx={{
          maxWidth: { md: INPUT_WIDTH },
          textTransform: 'capitalize',
        }}
      >
        <MenuItem value="">Tất cả</MenuItem>
        {optionsSupplier.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      {/* Bộ lọc Trạng thái */}
      <TextField
        fullWidth
        select
        label="Trạng thái"
        value={filterStatus}
        onChange={onFilterStatus}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } },
          },
        }}
        sx={{
          maxWidth: { md: INPUT_WIDTH },
          textTransform: 'capitalize',
        }}
      >
        <MenuItem value="">Tất cả</MenuItem>
        {optionsStatus.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      {/* Ô tìm kiếm mã phiếu */}
      <TextField
        fullWidth
        value={filterCode}
        onChange={(event) => onFilterCode(event.target.value)}
        placeholder="Tìm mã phiếu..."
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
}
