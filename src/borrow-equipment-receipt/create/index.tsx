import { Container } from '@mui/material';
import React from 'react';
import HeaderBreadcrumbs from 'src/common/components/HeaderBreadcrumbs';
import Page from 'src/common/components/Page';
import useSettings from 'src/common/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import BorrowReceiptNewEditForm from '../common/components/new-edit';

const CreateNewBorrowReceiptContainer = () => {
  const { themeStretch } = useSettings();
  return (
    <Page title="Danh sách phiếu mượn thiết bị">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Phiếu mượn thiết bị"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Phiếu mượn thiết bị', href: PATH_DASHBOARD.borrowReceipt?.list || '#' },
            { name: 'Danh sách' },
          ]}
        />
        <BorrowReceiptNewEditForm />
      </Container>
    </Page>
  );
};

export default CreateNewBorrowReceiptContainer;
