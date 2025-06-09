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
import { applySortFilterImportReceipts } from '../common/utils';
import { useGetListImportReceipts } from '../common/hooks/useGetListImportReceipt';
import {
  IMPORT_RECEIPT_STATUS_OPTIONS,
  TABLE_HEAD_IMPORT_RECEIPTS,
} from '../common/importReceipt.constant';
import ImportReceiptRow from './components/ImportReceiptRow';
import ImportReceiptToolbar from './components/ImportReceiptToolbar';
import { useGetListSuppliers } from '../common/hooks/useGetListSupplier';
import { IImportReceipt } from 'src/common/@types/import-receipt/import-receipt.interface';

const ListImportReceipts = () => {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();

  const [filterCode, setFilterCode] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('');
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
  } = useTable({ defaultOrderBy: 'dateOfOrder' });

  const denseHeight = dense ? 56 : 76;

  // Dữ liệu từ API
  const [tableData, setTableData] = useState<IImportReceipt[]>([]);

  const { data, isLoading, fetchData } = useGetListImportReceipts({
    onSuccess: () => {},
    onError: () => {},
  });

  const { data: supplierList, fetchData: fetchSuppliers } = useGetListSuppliers({
    onSuccess: () => {},
    onError: () => {},
  });

  useEffect(() => {
    fetchData({ page: 1, limit: 20 });
    fetchSuppliers({ page: 1, limit: 20 }); // lấy danh sách supplier
  }, []);

  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]);

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

        <Card>
          <ImportReceiptToolbar
            optionsSupplier={supplierList.map((supplier) => ({
              value: supplier.id,
              label: supplier.name,
            }))}
            optionsStatus={IMPORT_RECEIPT_STATUS_OPTIONS}
            filterSupplier={filterSupplier}
            filterStatus={filterStatus}
            filterCode={filterCode}
            onFilterSupplier={handleFilterSupplier}
            onFilterStatus={handleFilterStatus}
            onFilterCode={handleFilterCode}
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
                      {dataFiltered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <ImportReceiptRow
                            key={row.id}
                            row={row}
                            onEditRow={() => {
                              navigate(`${PATH_DASHBOARD.importReceipt.edit}/${row.id}`);
                            }}
                            onViewRow={() => {
                              console.log('View row', row);
                              navigate(PATH_DASHBOARD.importReceipt.view(String(row.id)));
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

export default ListImportReceipts;
