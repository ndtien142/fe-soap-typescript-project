import { Container, Tab, Tabs, Card } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import HeaderBreadcrumbs from 'src/common/components/HeaderBreadcrumbs';
import Page from 'src/common/components/Page';
import useSettings from 'src/common/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import SerialEquipmentInfo from './components/SerialEquipmentInfo';
import { useGetDetailEquipmentBySerial } from './hooks/useGetDetailEquipmentBySerial';
import HistoryOfUsingSerialEquipment from './components/HistoryOfUsingSerialEquipment';

const DetailSerialItemContainer = () => {
  const { themeStretch } = useSettings();
  const { id, serialNumber } = useParams<{ id: string; serialNumber: string }>();

  const { data: serialEquipment, isLoading, fetchData } = useGetDetailEquipmentBySerial();

  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (serialNumber) {
      fetchData(serialNumber);
    }
    // eslint-disable-next-line
  }, [serialNumber]);

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

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
        <Tabs value={tab} onChange={handleChangeTab} sx={{ mb: 3 }}>
          <Tab label="Thông tin thiết bị" />
          <Tab label="Lịch sử sử dụng" />
        </Tabs>
        {tab === 0 && serialEquipment && (
          <SerialEquipmentInfo
            serialEquipment={serialEquipment}
            isEdit={!isLoading}
            isSubmitting={isLoading}
          />
        )}
        {tab === 1 && serialNumber && (
          <Card sx={{ p: 3 }}>
            <HistoryOfUsingSerialEquipment serialNumber={serialNumber} />
          </Card>
        )}
      </Container>
    </Page>
  );
};

export default DetailSerialItemContainer;
