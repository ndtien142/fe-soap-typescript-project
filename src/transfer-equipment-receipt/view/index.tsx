import { Container } from '@mui/material';
import React, { useEffect } from 'react';
import HeaderBreadcrumbs from 'src/common/components/HeaderBreadcrumbs';
import Page from 'src/common/components/Page';
import useSettings from 'src/common/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/common/routes/paths';

const ViewImportReceiptContainer = () => {
  const { themeStretch } = useSettings();
  return (
    <Page title="Danh sách phiếu điều chuyển thiết bị">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Phiếu điều chuyển thiết bị"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Danh sách', href: PATH_DASHBOARD.importReceipt.list },
            { name: 'Chi tiết' },
          ]}
        />
      </Container>
    </Page>
  );
};

export default ViewImportReceiptContainer;
