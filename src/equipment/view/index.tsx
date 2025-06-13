import { Card, Container, Tab, Tabs, Typography } from '@mui/material';
import Page from 'src/common/components/Page';
import HeaderBreadcrumbs from 'src/common/components/HeaderBreadcrumbs';
import useSettings from 'src/common/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetDetailEquipmentGroup } from 'src/equipment/common/hooks/useGetDetailEquipmentGroup';
import DetailEquipmentGroup from './components/DetailEquipmentGroup';
import SerialNumberEquipmentList from './components/SerialNumberEquipmentList';

const EquipmentViewPage = () => {
  const { themeStretch } = useSettings();
  const [tab, setTab] = useState(0);
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, fetchData } = useGetDetailEquipmentGroup({
    onSuccess: () => {},
    onError: () => {
      console.error('Error fetching equipment group details:');
    },
  });

  useEffect(() => {
    if (id) fetchData(id);
    // eslint-disable-next-line
  }, [id]);

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
            { name: id || '...' },
          ]}
        />
        <Tabs value={tab} onChange={handleChangeTab} sx={{ mb: 3 }}>
          <Tab label="Chi tiết nhóm thiết bị" />
          <Tab label="Danh sách số serial" />
          <Tab label="Phiếu sửa chữa" />
        </Tabs>
        {tab === 0 && <DetailEquipmentGroup data={data} isLoading={isLoading} />}
        {tab === 1 && <SerialNumberEquipmentList data={data} isLoading={isLoading} />}
        {tab === 2 && (
          <Card sx={{ p: 3 }}>
            {/* TODO: Render repair receipt here */}
            <Typography>Phiếu sửa chữa</Typography>
          </Card>
        )}
      </Container>
    </Page>
  );
};

export default EquipmentViewPage;
