import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Card,
  TableContainer,
  Table,
  TableBody,
  Box,
  Switch,
  TablePagination,
  FormControlLabel,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import HeaderBreadcrumbs from 'src/common/components/HeaderBreadcrumbs';
import Page from 'src/common/components/Page';
import Iconify from 'src/common/components/Iconify';
import useSettings from 'src/common/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Scrollbar from 'src/common/components/Scrollbar';
import useTable, { getComparator } from 'src/common/hooks/useTable';
import { TableHeadCustom, TableNoData } from 'src/common/components/table';
import { applySortFilterImportReceipts } from '../common/utils';
import { useGetListImportReceipts } from '../common/hooks/useGetListImportReceipt';
import {
  IMPORT_RECEIPT_STATUS_OPTIONS,
  TABLE_HEAD_IMPORT_RECEIPTS,
} from '../common/importReceipt.constant';
import ImportReceiptRow from './components/ImportReceiptRow';
import ImportReceiptTableToolbar from '../common/components/list/ImportReceiptTableToolbar';
import { useGetListSuppliers } from '../common/hooks/useGetListSupplier';
import { IImportReceipt } from 'src/common/@types/import-receipt/import-receipt.interface';
import sumBy from 'lodash/sumBy';
import { useTheme } from '@mui/material/styles';
import ImportReceiptAnalytic from '../../common/components/ReceiptAnalytic';
import { useGetReportReceipt } from 'src/common/hooks/useGetReportReceipt';

const ListImportReceipts = () => {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const theme = useTheme();

  const [filterCode, setFilterCode] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'dateOfOrder' });

  const denseHeight = dense ? 56 : 76;

  // Dữ liệu từ API
  const [tableData, setTableData] = useState<IImportReceipt[]>([]);

  const { data, isLoading, fetchData, meta } = useGetListImportReceipts({
    onSuccess: () => {},
    onError: () => {},
  });

  const { data: supplierList, fetchData: fetchSuppliers } = useGetListSuppliers({
    onSuccess: () => {},
    onError: () => {},
  });

  // Use report hook
  const { data: reportData, isLoading: isReportLoading, fetchReport } = useGetReportReceipt();

  console.log('reportData', reportData);

  // Fetch data when page, rowsPerPage, or filterCode changes
  useEffect(() => {
    fetchData({
      page: page + 1,
      limit: rowsPerPage,
      searchText: filterCode,
    });
  }, [page, rowsPerPage, filterCode]);

  useEffect(() => {
    fetchSuppliers({ page: 1, limit: 20 }); // lấy danh sách supplier
  }, []);

  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]);

  // Fetch report on mount
  React.useEffect(() => {
    fetchReport('import');
  }, [fetchReport]);

  const dataFiltered = applySortFilterImportReceipts({
    tableData,
    comparator: getComparator(order, orderBy),
    filterCode,
    filterSupplier,
    filterStatus,
  });

  const handleFilterCode = (value: string) => {
    setFilterCode(value);
    setPage(0);
  };

  const handleFilterSupplier = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterSupplier(event.target.value);
    setPage(0);
  };

  const handleFilterStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  const handleFilterStartDate = (value: Date | null) => {
    setFilterStartDate(value);
    setPage(0);
  };

  const handleFilterEndDate = (value: Date | null) => {
    setFilterEndDate(value);
    setPage(0);
  };

  // Helper: get count by status from reportData
  const getCountByStatus = (status: string) =>
    reportData?.find((item: any) => item.status === status)?.count || 0;

  // Total receipts from report
  const totalReceipts = reportData
    ? reportData.reduce((sum: number, item: any) => sum + (item.count || 0), 0)
    : 0;

  // Status configs for analytic cards
  const STATUS_CONFIGS = [
    {
      status: 'received',
      label: 'Đã nhận hàng',
      icon: 'eva:archive-fill',
      color: theme.palette.info.main,
    },
    {
      status: 'approved',
      label: 'Đã duyệt',
      icon: 'eva:checkmark-circle-2-fill',
      color: theme.palette.success.main,
    },
    {
      status: 'requested',
      label: 'Đã yêu cầu',
      icon: 'eva:clock-fill',
      color: theme.palette.warning.main,
    },
    {
      status: 'rejected',
      label: 'Đã từ chối',
      icon: 'eva:close-circle-fill',
      color: theme.palette.error.main,
    },
    {
      status: 'returned',
      label: 'Trả hàng',
      icon: 'eva:undo-fill',
      color: theme.palette.secondary.main,
    },
  ];

  const isNotFound = !dataFiltered.length;

  return (
    <Page title="Danh sách phiếu nhập thiết bị">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Phiếu nhập thiết bị"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Phiếu nhập thiết bị', href: PATH_DASHBOARD.importReceipt.list },
            { name: 'Danh sách' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.importReceipt.new}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Tạo phiếu nhập
            </Button>
          }
        />

        {/* Analytic section */}
        <Card sx={{ mb: 5 }}>
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <ImportReceiptAnalytic
                icon="ic:round-receipt"
                status="Tổng"
                count={totalReceipts}
                color={theme.palette.primary.main}
                total={totalReceipts}
              />
              {STATUS_CONFIGS.map((cfg) => (
                <ImportReceiptAnalytic
                  key={cfg.status}
                  icon={cfg.icon}
                  status={cfg.label}
                  count={getCountByStatus(cfg.status)}
                  color={cfg.color}
                  total={totalReceipts}
                />
              ))}
            </Stack>
            {isReportLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </Scrollbar>
        </Card>

        <Card>
          <ImportReceiptTableToolbar
            optionsStatus={IMPORT_RECEIPT_STATUS_OPTIONS.map((option) => option.value)}
            filterName={filterCode}
            filterStatus={filterStatus}
            filterStartDate={filterStartDate}
            filterEndDate={filterEndDate}
            onFilterName={handleFilterCode}
            onFilterStatus={handleFilterStatus}
            onFilterStartDate={handleFilterStartDate}
            onFilterEndDate={handleFilterEndDate}
          />

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Scrollbar>
                <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                  <Table size={dense ? 'small' : 'medium'}>
                    <TableHeadCustom
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD_IMPORT_RECEIPTS}
                      rowCount={tableData.length}
                      onSort={onSort}
                    />
                    <TableBody>
                      {dataFiltered.map((row) => (
                        <ImportReceiptRow
                          key={row.id}
                          row={row}
                          onEditRow={() => {
                            navigate(PATH_DASHBOARD.importReceipt.edit(String(row.id)));
                          }}
                          onViewRow={() => {
                            console.log('View row', row);
                            navigate(PATH_DASHBOARD.importReceipt.view(String(row.id)));
                          }}
                        />
                      ))}

                      <TableNoData isNotFound={isNotFound} />
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>

              <Box sx={{ position: 'relative' }}>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={meta?.totalItems || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={onChangePage}
                  onRowsPerPageChange={onChangeRowsPerPage}
                />

                <FormControlLabel
                  control={<Switch checked={dense} onChange={onChangeDense} />}
                  label="Dense"
                  sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
                />
              </Box>
            </>
          )}
        </Card>
      </Container>
    </Page>
  );
};

export default ListImportReceipts;
