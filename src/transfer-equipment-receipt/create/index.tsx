import { Container } from '@mui/material';
import React from 'react';
import HeaderBreadcrumbs from 'src/common/components/HeaderBreadcrumbs';
import Page from 'src/common/components/Page';
import useSettings from 'src/common/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import TransferNewEditForm from '../common/components/new-edit-form';

const CreateNewImportReceiptContainer = () => {
  const { themeStretch } = useSettings();
  return (
    <Page title="Danh sách phiếu chuyển thiết bị">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Phiếu chuyển thiết bị"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Phiếu chuyển thiết bị', href: PATH_DASHBOARD.transferReceipt.list },
            { name: 'Tạo mới' },
          ]}
        />
        <TransferNewEditForm />
      </Container>
    </Page>
  );
};

export default CreateNewImportReceiptContainer;
