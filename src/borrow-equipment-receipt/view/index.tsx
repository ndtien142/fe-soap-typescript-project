import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import Page from 'src/common/components/Page';
import HeaderBreadcrumbs from 'src/common/components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import axiosInstance from 'src/common/utils/axios';
import BorrowReceiptDetail from '../common/components/details';
import BorrowReceiptToolbar from '../common/components/details/BorrowReceiptToolbar';
import { useGetDetailBorrow } from '../common/hooks/useGetDetailBorrow';

const BorrowReceiptViewContainer = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: borrowReceipt,
    fetchData,
    isLoading,
  } = useGetDetailBorrow({
    onSuccess: () => {},
    onError: (message) => console.error(message),
  });

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  return (
    <Page title="Chi tiết phiếu mượn thiết bị">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Chi tiết phiếu mượn thiết bị"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Phiếu mượn thiết bị', href: PATH_DASHBOARD.borrowReceipt.list },
            { name: id || '...' },
          ]}
        />
        {borrowReceipt && (
          <>
            <BorrowReceiptToolbar borrowReceipt={borrowReceipt} />
            <BorrowReceiptDetail borrowReceipt={borrowReceipt} />
          </>
        )}
      </Container>
    </Page>
  );
};

export default BorrowReceiptViewContainer;
