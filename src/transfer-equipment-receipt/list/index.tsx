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
  TableRow,
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
import { TransferTableRow } from '../common/components/list';
import { useGetListTransferReceipts } from '../common/hooks/useGetListTransferReceipt';
import {
  ITransferReceipts,
  ITransferReceiptParams,
} from 'src/common/@types/transfer-receipt/transfer-receipt.interface';

const ListTransferReceipts = () => {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();

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
  const [tableData, setTableData] = useState<ITransferReceipts[]>([]);

  const { data, isLoading, fetchData } = useGetListTransferReceipts({
    onSuccess: () => {},
    onError: () => {},
  });

  // Fetch data when page, rowsPerPage, or filterCode changes
  useEffect(() => {
    fetchData({
      page: page + 1,
      limit: rowsPerPage,
      searchText: filterCode,
    });
  }, [page, rowsPerPage, filterCode]);
  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]);

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

  return (
    <Page title="Danh sách phiếu chuyển thiết bị">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Phiếu Chuyển thiết bị"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Phiếu Chhuyển thiết bị', href: PATH_DASHBOARD.importReceipt.list },
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
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={[]}
                  rowCount={tableData.length}
                  onSort={onSort}
                />
                <TableBody>
                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={true} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={0}
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
        </Card>
      </Container>
    </Page>
  );
};

export default ListTransferReceipts;
