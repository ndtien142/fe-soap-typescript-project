import { Container } from '@mui/material';
import React from 'react';
import HeaderBreadcrumbs from 'src/common/components/HeaderBreadcrumbs';
import Page from 'src/common/components/Page';
import useSettings from 'src/common/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import FormCreateImportReceipt from './components/FormCreateImportReceipt';

const CreateNewImportReceiptContainer = () => {
  const { themeStretch } = useSettings();
  return (
    <Page title="Danh sách phiếu nhập thiết bị">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Phiếu nhập thiết bị"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Phiếu nhập thiết bị', href: PATH_DASHBOARD.importReceipt.list },
            { name: 'Danh sách' },
          ]}
        />
        <FormCreateImportReceipt />
      </Container>
    </Page>
  );
};

export default CreateNewImportReceiptContainer;
