import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Page from 'src/common/components/Page';
import { Container, CircularProgress, Box } from '@mui/material';
import HeaderBreadcrumbs from 'src/common/components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import { useGetDetailImportReceipt } from 'src/import-equipment-receipt/common/hooks/useGetDetailImportReceipt';
import ImportReceiptNewEditForm from '../common/components/new-edit-form';

export default function EditImportReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error, fetchDetail } = useGetDetailImportReceipt();

  useEffect(() => {
    if (id) {
      fetchDetail(id);
    }
  }, [id, fetchDetail]);

  if (isLoading) {
    return (
      <Page title="Chỉnh sửa phiếu nhập thiết bị">
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Page>
    );
  }

  if (error || !data) {
    return (
      <Page title="Chỉnh sửa phiếu nhập thiết bị">
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <span style={{ color: 'red' }}>Không tìm thấy phiếu nhập hoặc đã xảy ra lỗi.</span>
          </Box>
        </Container>
      </Page>
    );
  }

  return (
    <Page title="Chỉnh sửa phiếu nhập thiết bị">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Chỉnh sửa phiếu nhập thiết bị"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Phiếu nhập thiết bị', href: PATH_DASHBOARD.importReceipt.list },
            { name: 'Chỉnh sửa' },
          ]}
        />
        <ImportReceiptNewEditForm
          isEdit
          currentImportReceipt={{
            ...data,
            name: data.name ?? '',
            items: data.items.map((item) => ({
              ...item,
              price: Number(item.price),
            })),
          }}
        />
      </Container>
    </Page>
  );
}
