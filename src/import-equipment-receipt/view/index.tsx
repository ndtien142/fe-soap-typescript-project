import { Container } from '@mui/material';
import React, { useEffect } from 'react';
import HeaderBreadcrumbs from 'src/common/components/HeaderBreadcrumbs';
import Page from 'src/common/components/Page';
import useSettings from 'src/common/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import ViewImportReceipt from './components/ViewImportReceipt';
import { useGetDetailImportReceipt } from '../common/hooks/useGetDetailImportReceipt';

const ViewImportReceiptContainer = () => {
  const { themeStretch } = useSettings();
  const { data, loading, error, fetchDetail } = useGetDetailImportReceipt();

  useEffect(() => {
    const id = window.location.pathname.split('/').pop();
    if (id) {
      fetchDetail(id);
    }
  }, [fetchDetail]);

  console.log('Import Receipt Data:', data);

  return (
    <Page title="Danh sách phiếu nhập thiết bị">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Phiếu nhập thiết bị"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Danh sách', href: PATH_DASHBOARD.importReceipt.list },
            { name: 'Chi tiết' },
          ]}
        />
        {data && (
          <ViewImportReceipt
            importReceipt={{
              ...data,
              name: data.name ?? '',
              items:
                data.items?.map((item: any) => ({
                  ...item,
                  price: typeof item.price === 'string' ? Number(item.price) : item.price,
                })) ?? [],
            }}
          />
        )}
      </Container>
    </Page>
  );
};

export default ViewImportReceiptContainer;
