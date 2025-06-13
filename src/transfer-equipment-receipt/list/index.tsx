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
  TableCell,
} from '@mui/material';
import HeaderBreadcrumbs from 'src/common/components/HeaderBreadcrumbs';
import Page from 'src/common/components/Page';
import Iconify from 'src/common/components/Iconify';
import useSettings from 'src/common/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Scrollbar from 'src/common/components/Scrollbar';
import useTable from 'src/common/hooks/useTable';
import { TableHeadCustom, TableNoData } from 'src/common/components/table';
import { useGetListTransferReceipts } from '../common/hooks/useGetListTransferReceipt';
import { ITransferReceipts } from 'src/common/@types/transfer-receipt/transfer-receipt.interface';
import { TransferTableRow } from '../common/components/list';

const TABLE_HEAD = [
  { id: 'transferFrom', label: 'Chuyển từ', align: 'left' },
  { id: 'transferTo', label: 'Chuyển đến', align: 'left' },
  { id: 'transferDate', label: 'Ngày chuyển', align: 'left' },
  { id: 'responsibleBy', label: 'Người chịu trách nhiệm', align: 'left' },
  { id: 'createdBy', label: 'Người tạo', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left' },
  { id: 'notes', label: 'Ghi chú', align: 'left' },
  { id: '' },
];

const ListTransferReceipts = () => {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();

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
  const { data, meta, isLoading, fetchData } = useGetListTransferReceipts({
    onSuccess: () => {},
    onError: () => {},
  });

  // Fetch data when page, rowsPerPage, or filterCode changes
  useEffect(() => {
    fetchData({
      page: page + 1,
      limit: rowsPerPage,
    });
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]);

  const handleEditRow = (row: ITransferReceipts) => {
    navigate(PATH_DASHBOARD.transferReceipt.edit(String(row.id)));
  };

  const handleViewRow = (row: ITransferReceipts) => {
    navigate(PATH_DASHBOARD.transferReceipt.view(String(row.id)));
  };

  return (
    <Page title="Danh sách phiếu chuyển thiết bị">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Phiếu Chuyển thiết bị"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Phiếu huyển thiết bị', href: PATH_DASHBOARD.transferReceipt.list },
            { name: 'Danh sách' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.transferReceipt.new}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Tạo phiếu chuyển thiết bị
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
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  onSort={onSort}
                />
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={TABLE_HEAD.length} align="center">
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : tableData.length > 0 ? (
                    tableData.map((row) => (
                      <TransferTableRow
                        key={row.id}
                        row={row}
                        onEditRow={handleEditRow}
                        onViewRow={handleViewRow}
                      />
                    ))
                  ) : (
                    <TableNoData isNotFound />
                  )}
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
        </Card>
      </Container>
    </Page>
  );
};

export default ListTransferReceipts;
