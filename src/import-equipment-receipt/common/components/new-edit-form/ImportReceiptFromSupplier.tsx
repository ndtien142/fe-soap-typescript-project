// @mui
import { Dialog, ListItemButton, Stack, Typography } from '@mui/material';
// @types
import { ISupplier } from 'src/common/@types/import-receipt/supplier.interface';
// components
import Iconify from 'src/common/components/Iconify';
import Scrollbar from 'src/common/components/Scrollbar';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  selected: (selectedId: number) => boolean;
  onClose: VoidFunction;
  onSelect: (supplier: ISupplier | null) => void;
  supplierOptions: ISupplier[];
};

export default function ImportReceiptFromSupplier({
  open,
  selected,
  onClose,
  onSelect,
  supplierOptions,
}: Props) {
  const handleSelect = (supplier: ISupplier | null) => {
    onSelect(supplier);
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ py: 2.5, px: 3 }}
      >
        <Typography variant="h6">Chọn nhà cung cấp</Typography>
        {/* Add New Supplier button can be implemented if needed */}
      </Stack>

      <Scrollbar sx={{ p: 1.5, pt: 0, maxHeight: 80 * 8 }}>
        {supplierOptions.map((supplier) => (
          <ListItemButton
            key={supplier.id}
            selected={selected(supplier.id)}
            onClick={() => handleSelect(supplier)}
            sx={{
              p: 1.5,
              borderRadius: 1,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Typography variant="subtitle2">{supplier.name}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {supplier.address}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {supplier.phone}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {supplier.email}
            </Typography>
          </ListItemButton>
        ))}
      </Scrollbar>
    </Dialog>
  );
}
