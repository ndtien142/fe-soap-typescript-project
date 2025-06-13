import { Container } from '@mui/material';
import React from 'react';
import HeaderBreadcrumbs from 'src/common/components/HeaderBreadcrumbs';
import Page from 'src/common/components/Page';
import useSettings from 'src/common/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import LiquidationReceiptNewEditForm from '../common/components/new-edit';


const LiquidationReceiptCreate = () => {
  const { themeStretch } = useSettings();

  return (
    <Page title="Danh sách phiếu thanh lý thiết bị">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Phiếu thanh lý thiết bị"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Phiếu thanh lý thiết bị',
              href: PATH_DASHBOARD.liquidationReceipt?.list || '#',
            },
            { name: 'Danh sách' },
          ]}
        />
        <LiquidationReceiptNewEditForm />
      </Container>
    </Page>
  );
};

export default LiquidationReceiptCreate;
