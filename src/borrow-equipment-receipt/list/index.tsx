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
import { useGetListBorrowReceipt } from '../common/hooks/useGetListBorrowReceipt';
import BorrowEquipmentRow from '../common/components/BorrowEquipmentRow';
import BorrowEquipmentToolbar from '../common/components/BorrowEquipmentToolbar';
import { IBorrowReceipt } from 'src/common/@types/borrow-receipt/borrowReceipt.interface';
import { TABLE_HEAD_BORROW_RECEIPTS } from '../common/constant';

const BorrowEquipmentList = () => {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();

  const [filterUser, setFilterUser] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
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

  // Fetch data from API with filters and pagination
  const { data, loading, fetchData } = useGetListBorrowReceipt({
    page: page + 1,
    limit: rowsPerPage,
    searchText: filterUser,
    status: filterStatus,
    // Add more params if needed
  });

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, filterUser, filterRoom, filterStatus]);

  useEffect(() => {
    // Update table data when fetched data changes
    setTableData(data);
  }, [data]);

  const [tableData, setTableData] = useState<IBorrowReceipt[]>([]);

  // Simple filter and sort (expand as needed)
  function applySortFilter({
    tableData,
    comparator,
    filterUser,
    filterRoom,
    filterStatus,
  }: {
    tableData: IBorrowReceipt[];
    comparator: (a: IBorrowReceipt, b: IBorrowReceipt) => number;
    filterUser: string;
    filterRoom: string;
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
        row.requestedBy.username.toLowerCase().includes(filterUser.toLowerCase())
      );
    }
    if (filterRoom) {
      filtered = filtered.filter((row) =>
        row.room.roomName.toLowerCase().includes(filterRoom.toLowerCase())
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
      a: IBorrowReceipt,
      b: IBorrowReceipt
    ) => number,
    filterUser,
    filterRoom,
    filterStatus,
  });

  const isNotFound = !dataFiltered.length;

  const handleFilterUser = (value: string) => {
    setFilterUser(value);
    setPage(0);
  };

  const handleFilterRoom = (value: string) => {
    setFilterRoom(value);
    setPage(0);
  };

  const handleFilterStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  return (
    <Page title="Danh sách phiếu mượn thiết bị">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Phiếu mượn thiết bị"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Phiếu mượn thiết bị', href: PATH_DASHBOARD.borrowReceipt.list },
            { name: 'Danh sách' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.borrowReceipt.new}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Tạo phiếu mượn
            </Button>
          }
        />

        <Card>
          <BorrowEquipmentToolbar
            filterUser={filterUser}
            filterRoom={filterRoom}
            filterStatus={filterStatus}
            onFilterUser={handleFilterUser}
            onFilterRoom={handleFilterRoom}
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
                      headLabel={TABLE_HEAD_BORROW_RECEIPTS}
                      rowCount={tableData.length}
                      onSort={onSort}
                    />
                    <TableBody>
                      {dataFiltered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((receipt) => (
                          <BorrowEquipmentRow
                            key={receipt.id}
                            receipt={receipt}
                            onEditRow={() => {
                              navigate(PATH_DASHBOARD.borrowReceipt.edit(String(receipt.id)));
                            }}
                            onViewRow={() => {
                              navigate(PATH_DASHBOARD.borrowReceipt.view(String(receipt.id)));
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

export default BorrowEquipmentList;
