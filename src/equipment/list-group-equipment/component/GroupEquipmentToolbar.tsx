import { InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import React from 'react';
import Iconify from 'src/common/components/Iconify';

const INPUT_WIDTH = 160;

type Props = {
  optionsManufacturer: string[];
  optionsType: string[];
  filterManufacturer: string;
  filterType: string;
  filterNameOrCode: string;
  onFilterManufacturer: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterType: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterNameOrCode: (value: string) => void;
};

export default function GroupEquipmentToolbar({
  optionsManufacturer,
  optionsType,
  filterManufacturer,
  filterType,
  filterNameOrCode,
  onFilterManufacturer,
  onFilterType,
  onFilterNameOrCode,
}: Props) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 3 }}>
      {/* Bộ lọc Hãng */}
      <TextField
        fullWidth
        select
        label="Hãng"
        value={filterManufacturer}
        onChange={onFilterManufacturer}
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
        {optionsManufacturer.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>

      {/* Bộ lọc Loại */}
      <TextField
        fullWidth
        select
        label="Loại"
        value={filterType}
        onChange={onFilterType}
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
        {optionsType.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>

      {/* Ô tìm kiếm tên hoặc mã thiết bị */}
      <TextField
        fullWidth
        value={filterNameOrCode}
        onChange={(event) => onFilterNameOrCode(event.target.value)}
        placeholder="Tìm theo tên hoặc mã..."
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
