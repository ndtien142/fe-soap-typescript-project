// form
import { useFormContext } from 'react-hook-form';
// @mui
import { Stack, Divider, Typography, Button } from '@mui/material';
// hooks
import useToggle from 'src/common/hooks/useToggle';
import useResponsive from 'src/common/hooks/useResponsive';
import { useEffect } from 'react';
import { useGetListSuppliers } from '../../hooks/useGetListSupplier';
// _mock
import { _invoiceAddressFrom, _invoiceAddressTo } from 'src/common/_mock';
// components
import ImportReceiptFromSupplier from './ImportReceiptFromSupplier';
import Iconify from 'src/common/components/Iconify';
//

// ----------------------------------------------------------------------

export default function ImportNewEditAddress() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const upMd = useResponsive('up', 'md');
  const {
    toggle: openSupplier,
    onOpen: onOpenSupplier,
    onClose: onCloseSupplier,
  }: { toggle: boolean; onOpen: () => void; onClose: () => void } = useToggle();

  const values = watch();
  const supplier = values.supplier || {};

  // Call API to get suppliers
  const {
    data: supplierOptions,
    isLoading: isLoadingSuppliers,
    fetchData: fetchSuppliers,
  } = useGetListSuppliers({ onSuccess: () => {}, onError: () => {} });

  useEffect(() => {
    fetchSuppliers({ page: 1, limit: 100 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Disable all fields if status is not 'requested'
  const isStatusReceived = values.status === 'received';
  const isStatusApproved = values.status === 'approved';
  const isStatusRejected = values.status === 'rejected';
  const allDisabled = isStatusReceived || isStatusApproved || isStatusRejected;

  const handleSelectSupplier = (selectedSupplier: any) => {
    setValue('supplier', selectedSupplier);
  };

  return (
    <Stack
      spacing={{ xs: 2, md: 5 }}
      direction={{ xs: 'column', md: 'row' }}
      divider={
        <Divider
          flexItem
          orientation={upMd ? 'vertical' : 'horizontal'}
          sx={{ borderStyle: 'dashed' }}
        />
      }
      sx={{ p: 3 }}
    >
      <Stack sx={{ width: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            Nhà cung cấp
          </Typography>
          <Button
            size="small"
            startIcon={<Iconify icon="eva:edit-fill" />}
            onClick={onOpenSupplier}
            disabled={allDisabled}
          >
            Chọn
          </Button>
          <ImportReceiptFromSupplier
            open={openSupplier}
            onClose={onCloseSupplier}
            selected={(id: number) => supplier?.id === id}
            onSelect={handleSelectSupplier}
            supplierOptions={supplierOptions}
          />
        </Stack>
        <SupplierInfo
          name={supplier.name}
          address={supplier.address}
          phone={supplier.phone}
          email={supplier.email}
        />
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type SupplierInfoProps = {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
};

function SupplierInfo({ name, address, phone, email }: SupplierInfoProps) {
  return (
    <>
      <Typography variant="subtitle2">{name || 'Chưa chọn nhà cung cấp'}</Typography>
      <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
        {address}
      </Typography>
      <Typography variant="body2">Phone: {phone}</Typography>
      <Typography variant="body2">Email: {email}</Typography>
    </>
  );
}
