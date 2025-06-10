import { Container } from '@mui/material';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import HeaderBreadcrumbs from 'src/common/components/HeaderBreadcrumbs';
import Page from 'src/common/components/Page';
import useSettings from 'src/common/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import SerialEquipmentInfo from './components/SerialEquipmentInfo';
import { useGetDetailEquipmentBySerial } from './hooks/useGetDetailEquipmentBySerial';

const DetailSerialItemContainer = () => {
  const { themeStretch } = useSettings();
  const { id, serialNumber } = useParams<{ id: string; serialNumber: string }>();

  const { data: serialEquipment, isLoading, fetchData } = useGetDetailEquipmentBySerial();

  useEffect(() => {
    if (serialNumber) {
      fetchData(serialNumber);
    }
    // eslint-disable-next-line
  }, [serialNumber]);
  console.log('serialEquipment', serialEquipment);

  return (
    <Page title="Danh sách thiết bị">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách thiết bị"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Thiết bị', href: PATH_DASHBOARD.equipment?.listGroup || '#' },
            { name: id || '...', href: PATH_DASHBOARD.equipment?.view(id || '') },
            { name: serialNumber || '...' },
          ]}
        />
        {serialEquipment && (
          <SerialEquipmentInfo
            serialEquipment={serialEquipment}
            isEdit={!isLoading}
            isSubmitting={isLoading}
          />
        )}
      </Container>
    </Page>
  );
};

export default DetailSerialItemContainer;
