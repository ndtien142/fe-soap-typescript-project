import React from 'react';
import { Container } from '@mui/material';
import HeaderBreadcrumbs from 'src/common/components/HeaderBreadcrumbs';
import Page from 'src/common/components/Page';
import useSettings from 'src/common/hooks/useSettings';
import vn from 'src/common/locales/vn';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import GroupEquipmentNewEditForm from './components/GroupEquipmentNewEditForm';

const CreateGroupEquipmentContainer = () => {
  const { themeStretch } = useSettings();
  console.log('FormCreateGroupEquipment');
  return (
    <Page title={`${vn.equipment.listGroupEquipment}`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Tạo nhóm thiết bị"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Nhóm thiết bị', href: PATH_DASHBOARD.equipment.listGroup },
            { name: 'Tạo nhóm thiết bị' },
          ]}
        />
        <GroupEquipmentNewEditForm isEdit={false} />
      </Container>
    </Page>
  );
};

export default CreateGroupEquipmentContainer;
