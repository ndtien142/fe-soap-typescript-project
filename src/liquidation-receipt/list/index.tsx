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
} from '@mui/material';
import HeaderBreadcrumbs from 'src/common/components/HeaderBreadcrumbs';
import Page from 'src/common/components/Page';
import Iconify from 'src/common/components/Iconify';
import useSettings from 'src/common/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Scrollbar from 'src/common/components/Scrollbar';
import useTable, { emptyRows, getComparator } from 'src/common/hooks/useTable';
import { TableEmptyRows, TableHeadCustom, TableNoData } from 'src/common/components/table';
import { ILiquidationReceipt } from 'src/common/@types/liquidation-receipt/liquidationReceipt.interface';
import { TABLE_HEAD_LIQUIDATION_RECEIPTS } from '../common/constant';
import LiquidationReceiptToolbar from './components/LiquidationReceiptToolbar';
import LiquidationReceiptRow from './components/LiquidationReceiptRow';
import { useGetListLiquidationReceipt } from '../common/hook/useGetListLiquidationReceipt';

const LiquidationReceiptList = () => {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();

  const [filterUser, setFilterUser] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

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
  } = useTable({ defaultOrderBy: 'createdTime' });

  const denseHeight = dense ? 56 : 76;

  const { data, loading, fetchData } = useGetListLiquidationReceipt({
    page: page + 1,
    limit: rowsPerPage,
    searchText: filterUser,
    status: filterStatus,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const [tableData, setTableData] = useState<ILiquidationReceipt[]>([]);

  // useEffect(() => {
  //   setTableData(data);
  // }, [data]);

  function applySortFilter({
    tableData,
    comparator,
    filterUser,
    filterStatus,
  }: {
    tableData: ILiquidationReceipt[];
    comparator: (a: ILiquidationReceipt, b: ILiquidationReceipt) => number;
    filterUser: string;
    filterStatus: string;
  }) {
    const stabilizedThis = tableData.map((el, index) => [el, index] as const);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    let filtered = stabilizedThis.map((el) => el[0]);

    if (filterUser) {
  filtered = filtered.filter((row) =>
    row.userCode.toLowerCase().includes(filterUser.toLowerCase())
  );
}

    if (filterStatus) {
      filtered = filtered.filter((row) => row.status === filterStatus);
    }

    return filtered;
  }

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy) as unknown as (
      a: ILiquidationReceipt,
      b: ILiquidationReceipt
    ) => number,
    filterUser,
    filterStatus,
  });

  const isNotFound = !dataFiltered.length;

  const handleFilterUser = (value: string) => {
    setFilterUser(value);
    setPage(0);
  };

  const handleFilterStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  return (
    <Page title="Danh sách phiếu thanh lý thiết bị">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách Phiếu thanh lý thiết bị"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Phiếu thanh lý thiết bị', href: PATH_DASHBOARD.liquidationReceipt.list },
            { name: 'Danh sách' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.liquidationReceipt.new}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Tạo phiếu thanh lý
            </Button>
          }
        />

        <Card>
          <LiquidationReceiptToolbar
            filterUser={filterUser}
            filterStatus={filterStatus}
            onFilterUser={handleFilterUser}
            onFilterStatus={handleFilterStatus}
          />

          {loading ? (
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
                      headLabel={TABLE_HEAD_LIQUIDATION_RECEIPTS}
                      rowCount={tableData.length}
                      // onSort={onSort}
                    />
                    <TableBody>
                      {dataFiltered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((receipt) => (
                          <LiquidationReceiptRow
                            key={receipt.id}
                            receipt={receipt}
                            onEditRow={() => {
                              navigate(PATH_DASHBOARD.liquidationReceipt.edit(String(receipt.id)));
                            }}
                            onViewRow={() => {
                              navigate(PATH_DASHBOARD.liquidationReceipt.view(String(receipt.id)));
                            }}
                          />
                        ))}

                      <TableEmptyRows
                        height={denseHeight}
                        emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                      />

                      <TableNoData isNotFound={isNotFound} />
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>

              <Box sx={{ position: 'relative' }}>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={dataFiltered.length}
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

export default LiquidationReceiptList;
