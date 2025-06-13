import { Container } from '@mui/material';
import React from 'react';
import HeaderBreadcrumbs from 'src/common/components/HeaderBreadcrumbs';
import Page from 'src/common/components/Page';
import useSettings from 'src/common/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import RepairReceiptNewEditForm from '../common/components/new-edit';


const RepairReceiptCreate = () => {
  const { themeStretch } = useSettings();

  return (
    <Page title="Tạo phiếu sửa chữa thiết bị">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Phiếu sửa chữa thiết bị"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Phiếu sửa chữa thiết bị',
              href: PATH_DASHBOARD.repairReceipt?.list || '#',
            },
            { name: 'Tạo mới' },
          ]}
        />
        <RepairReceiptNewEditForm />
      </Container>
    </Page>
  );
};

export default RepairReceiptCreate;
