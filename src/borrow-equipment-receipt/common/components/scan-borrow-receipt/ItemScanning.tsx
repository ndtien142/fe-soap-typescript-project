import React from 'react';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Collapse,
  IconButton,
  Stack,
  Chip,
} from '@mui/material';
import Iconify from 'src/common/components/Iconify';
import {
  IBorrowEquipment,
  IRequestItem,
} from 'src/common/@types/borrow-receipt/borrowReceipt.interface';
import axiosInstance from 'src/common/utils/axios';
import { API_BORROW_RECEIPT } from 'src/common/constant/api.constant';
import { useParams } from 'react-router-dom';
import { default as useMessage } from 'src/common/hooks/useMessage';
import { useDispatch } from 'src/common/redux/store';
import { triggerRefetch } from 'src/borrow-equipment-receipt/scan/scan.slice';

interface Props {
  borrowEquipments: IBorrowEquipment[];
  requestItems: IRequestItem[];
}

function getStatusColor(status: string) {
  switch (status) {
    case 'reserved':
      return 'primary';
    case 'borrowed':
      return 'success';
    case 'returned':
      return 'info';
    default:
      return 'default';
  }
}

const ScanQRCode = ({ borrowEquipments = [], requestItems = [] }: Props) => {
  // Group serials by groupEquipmentCode
  const groupMap: Record<string, IBorrowEquipment[]> = {};
  borrowEquipments.forEach((eq) => {
    console.log('eq: ', eq.groupEquipmentCode);
    if (!groupMap[eq.groupEquipmentCode]) groupMap[eq.groupEquipmentCode] = [];
    groupMap[eq.groupEquipmentCode].push(eq);
  });

  console.log('groupMap: ', groupMap);

  // Expand/collapse state for each group
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({});

  // Initial expand all groups on first render
  React.useEffect(() => {
    if (requestItems.length) {
      const initial: Record<string, boolean> = {};
      requestItems.forEach((group) => {
        initial[group.groupEquipmentCode] = true;
      });
      setOpenGroups(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestItems]);

  const handleToggleGroup = (code: string) => {
    setOpenGroups((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { showErrorSnackbar, showSuccessSnackbar } = useMessage();

  const handleDeleteSerial = async (serialNumber: string) => {
    if (!id) return;
    try {
      await axiosInstance.post(`${API_BORROW_RECEIPT}/delete-scanned-equipment`, {
        borrowReceiptId: Number(id),
        serialNumber,
      });
      showSuccessSnackbar('Xóa thiết bị thành công!');
      dispatch(triggerRefetch());
    } catch (err: any) {
      showErrorSnackbar(err?.message || 'Xóa thiết bị thất bại!');
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Danh sách nhóm thiết bị và thiết bị mượn
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Mã nhóm</TableCell>
              <TableCell>Tên nhóm</TableCell>
              <TableCell>Số lượng yêu cầu</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Hãng</TableCell>
              <TableCell>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requestItems.map((group) => (
              <React.Fragment key={group.groupEquipmentCode}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleGroup(group.groupEquipmentCode)}
                      aria-label="expand row"
                    >
                      <Iconify
                        icon={
                          openGroups[group.groupEquipmentCode]
                            ? 'eva:arrow-ios-downward-fill'
                            : 'eva:arrow-ios-forward-fill'
                        }
                      />
                    </IconButton>
                  </TableCell>
                  <TableCell>{group.groupEquipmentCode}</TableCell>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>{group.quantity}</TableCell>
                  <TableCell>{group.type?.name}</TableCell>
                  <TableCell>{group.manufacturer?.name}</TableCell>
                  <TableCell>{group.note || '-'}</TableCell>
                </TableRow>
                {openGroups[group.groupEquipmentCode] && (
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                      <Collapse
                        in={openGroups[group.groupEquipmentCode]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 1 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Thiết bị thuộc nhóm {group.groupEquipmentCode} - {group.name}
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Số serial</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {(groupMap[group.groupEquipmentCode] || []).map((serial) => (
                                <TableRow key={serial.serialNumber}>
                                  <TableCell>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                      <Typography>{serial.serialNumber}</Typography>
                                      <Chip
                                        size="small"
                                        label={serial.status}
                                        color={getStatusColor(serial.status) as any}
                                      />
                                    </Stack>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      size="small"
                                      label={serial.status}
                                      color={getStatusColor(serial.status) as any}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <IconButton
                                      color="error"
                                      size="small"
                                      onClick={() => handleDeleteSerial(serial.serialNumber)}
                                    >
                                      <Iconify icon="eva:trash-2-outline" />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {(!groupMap[group.groupEquipmentCode] ||
                                groupMap[group.groupEquipmentCode].length === 0) && (
                                <TableRow>
                                  <TableCell colSpan={3}>Không có thiết bị nào.</TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default ScanQRCode;
