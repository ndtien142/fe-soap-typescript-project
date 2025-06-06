import React, { useState } from 'react';
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
} from '@mui/material';
import HeaderBreadcrumbs from 'src/common/components/HeaderBreadcrumbs';
import Page from 'src/common/components/Page';
import Iconify from 'src/common/components/Iconify';
import useSettings from 'src/common/hooks/useSettings';
import vn from 'src/common/locales/vn';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Scrollbar from 'src/common/components/Scrollbar';
import GroupEquipmentToolbar from './component/GroupEquipmentToolbar';
import { applySortFilter } from './utils';
import { IGroupEquipment } from './equipmentGroup.interface';
import useTable, { emptyRows, getComparator } from 'src/common/hooks/useTable';
import { mockEquipmentResponse, TABLE_HEAD_GROUP_EQUIPMENT } from './constant';
import { TableEmptyRows, TableHeadCustom, TableNoData } from 'src/common/components/table';
import GroupEquipmentRow from './component/GroupEquipmentRow';

const MANUFACTURER_OPTIONS = ['Hãng A', 'Hãng B', 'Hãng C']; // Sửa theo data thật
const TYPE_OPTIONS = ['Loại 1', 'Loại 2', 'Loại 3']; // Sửa theo data thật

const ListGroupEquipment = () => {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();

  // useTable
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
  } = useTable({ defaultOrderBy: 'createDate' });

  const denseHeight = dense ? 56 : 76;

  // State
  const [tableData, setTableData] = useState(
    mockEquipmentResponse.metadata.metadata as unknown as IGroupEquipment[]
  );

  const [filterNameOrCode, setFilterNameOrCode] = useState('');
  const [filterManufacturer, setFilterManufacturer] = useState('');
  const [filterType, setFilterType] = useState('');

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterNameOrCode,
    filterManufacturer,
    filterType,
  });

  const isNotFound =
    (!dataFiltered.length && !!filterNameOrCode) ||
    (!dataFiltered.length && !!filterManufacturer) ||
    (!dataFiltered.length && !!filterType);

  // Function handle filter
  const handleFilterNameOrCode = (value: string) => {
    setFilterNameOrCode(value);
    setPage(0);
  };

  const handleFilterManufacturer = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterManufacturer(event.target.value);
    setPage(0);
  };

  const handleFilterType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterType(event.target.value);
    setPage(0);
  };

  // Navigation
  const handleEditRow = (id: string) => {
    navigate(PATH_DASHBOARD.equipment.view(id));
  };

  const handleViewRow = (id: string) => {
    navigate(PATH_DASHBOARD.equipment.view(id));
  };

  return (
    <Page title={`${vn.equipment.listGroupEquipment}`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Nhóm thiết bị"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Nhóm thiết bị', href: PATH_DASHBOARD.equipment.listGroup },
            { name: 'Danh sách' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.equipment.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Thêm mới nhóm thiết bị
            </Button>
          }
        />

        <Card>
          <GroupEquipmentToolbar
            filterNameOrCode={filterNameOrCode}
            filterManufacturer={filterManufacturer}
            filterType={filterType}
            onFilterNameOrCode={handleFilterNameOrCode}
            onFilterManufacturer={handleFilterManufacturer}
            onFilterType={handleFilterType}
            optionsManufacturer={MANUFACTURER_OPTIONS}
            optionsType={TYPE_OPTIONS}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD_GROUP_EQUIPMENT}
                  rowCount={tableData.length}
                  onSort={onSort}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <GroupEquipmentRow
                        key={row.code}
                        row={row}
                        onViewRow={() => handleViewRow(row.code)}
                        onEditRow={() => handleEditRow(row.code)}
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
        </Card>
      </Container>
    </Page>
  );
};

export default ListGroupEquipment;
