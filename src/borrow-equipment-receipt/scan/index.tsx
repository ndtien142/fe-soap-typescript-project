// MUI
import { Container, Box, StepConnector, Grid, Stepper, Step, StepLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
// React
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
// Router
import { PATH_DASHBOARD } from 'src/common/routes/paths';
// Components
import ScanBorrowReceipt from '../common/components/scan-borrow-receipt';
import AvailableEquipmentCheck from '../common/components/scan-borrow-receipt/AvailableEquipmentCheck';
import { useGetDetailBorrow } from '../common/hooks/useGetDetailBorrow';
import { useGetListAvailable } from '../common/hooks/useGetListAvailable';
import { onNextStep, setBorrowEquipments, setRequestItems } from './scan.slice';
import Iconify from 'src/common/components/Iconify';
import { useDispatch, useSelector } from 'src/common/redux/store';
import Page from 'src/common/components/Page';
import HeaderBreadcrumbs from 'src/common/components/HeaderBreadcrumbs';
import UploadConfirmAndSuccessBorrow from '../common/components/scan-borrow-receipt/UploadConfirmAndSuccessBorrow';
import BorrowedSuccess from '../common/components/scan-borrow-receipt/BorrowedSuccess';

const STEPS = ['Kiểm tra', 'Quét', 'Xác nhận và cung cấp chứng từ'];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  top: 10,
  left: 'calc(-50% + 20px)',
  right: 'calc(50% + 20px)',
  '& .MuiStepConnector-line': {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  '&.Mui-active, &.Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

function QontoStepIcon({ active, completed }: { active: boolean; completed: boolean }) {
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? 'primary.main' : 'text.disabled',
      }}
    >
      {completed ? (
        <Iconify
          icon={'eva:checkmark-fill'}
          sx={{ zIndex: 1, width: 20, height: 20, color: 'primary.main' }}
        />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
          }}
        />
      )}
    </Box>
  );
}

const ScanBorrowReceiptContainer = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const {
    triggerCallApi,
    activeStep,
    borrowEquipments = [],
    requestItems = [],
  } = useSelector((state) => state.scanBorrowReceipt);

  const [availableData, setAvailableData] = useState<any[]>([]);
  const [allAvailable, setAllAvailable] = useState(false);
  const [success, setSuccess] = useState(false);

  const isComplete = activeStep === STEPS.length;

  // Fetch borrow receipt detail and update redux state
  const { isLoading, data, fetchData } = useGetDetailBorrow({
    onSuccess: () => {},
    onError: () => {},
  });

  const {
    isLoading: isLoadingAvailable,
    data: availableList,
    allAvailable: allAvailableFlag,
    fetchData: fetchAvailable,
  } = useGetListAvailable({
    onSuccess: () => {},
    onError: () => {},
  });

  useEffect(() => {
    if (id) {
      fetchData(id);
      fetchAvailable(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, triggerCallApi]);

  useEffect(() => {
    if (data) {
      dispatch(setBorrowEquipments(data.borrowEquipments || []));
      dispatch(setRequestItems(data.requestItems || []));
    }
  }, [data, dispatch]);

  useEffect(() => {
    setAvailableData(availableList);
    setAllAvailable(allAvailableFlag);
  }, [availableList, allAvailableFlag]);

  const handleProcess = () => {
    dispatch(onNextStep());
  };

  const scannedCountByGroup = requestItems.reduce((acc, req) => {
    acc[req.groupEquipmentCode] = borrowEquipments.filter(
      (eq) => eq.groupEquipmentCode === req.groupEquipmentCode
    ).length;
    return acc;
  }, {} as Record<string, number>);

  console.log('scannedCountByGroup: ', scannedCountByGroup);

  const handleConfirmSuccess = () => {
    setSuccess(true);
  };

  return (
    <Page title="Quét thiết bị mượn">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Quét thiết bị mượn"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Phiếu mượn thiết bị', href: PATH_DASHBOARD.borrowReceipt.list },
            { name: id || '...' },
            { name: 'Quét thiết bị' },
          ]}
        />
        <Grid container justifyContent={isComplete ? 'center' : 'flex-start'}>
          <Grid item xs={12} md={8} sx={{ mb: 5 }}>
            <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
              {STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={QontoStepIcon}
                    sx={{
                      '& .MuiStepLabel-label': {
                        typography: 'subtitle2',
                        color: 'text.disabled',
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
        </Grid>
        {!isComplete ? (
          <>
            {activeStep === 0 && (
              <AvailableEquipmentCheck
                data={availableData}
                allAvailable={allAvailable}
                onProcess={handleProcess}
                isLoading={isLoadingAvailable}
                scannedByGroup={scannedCountByGroup}
              />
            )}
            {activeStep === 1 && (
              // Quét
              <ScanBorrowReceipt borrowEquipments={borrowEquipments} requestItems={requestItems} />
            )}
            {activeStep === 2 &&
              // Xác nhận và cung cấp chứng từ
              (!success ? (
                <UploadConfirmAndSuccessBorrow onSuccess={handleConfirmSuccess} />
              ) : (
                <BorrowedSuccess />
              ))}
          </>
        ) : (
          <h1>1</h1>
        )}
      </Container>
    </Page>
  );
};

export default ScanBorrowReceiptContainer;
