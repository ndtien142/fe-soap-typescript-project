export const TABLE_HEAD_IMPORT_RECEIPTS = [
  { id: 'code', label: 'Mã phiếu nhập', align: 'left' },
  { id: 'dateOfOrder', label: 'Ngày đặt hàng', align: 'left' },
  { id: 'dateOfReceived', label: 'Ngày nhận dự kiến', align: 'left' },
  { id: 'dateOfActualReceived', label: 'Ngày nhận thực tế', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left' },
  { id: 'note', label: 'Ghi chú', align: 'left' },
  { id: 'supplier', label: 'Nhà cung cấp', align: 'left' },
  { id: 'requestedUser', label: 'Người yêu cầu', align: 'left' },
  { id: '', label: '', align: 'right' },
];

export const IMPORT_RECEIPT_STATUS_OPTIONS = [
  { value: 'requested', label: 'Requested' },
  { value: 'approved', label: 'Approved' },
  { value: 'processing', label: 'Processing' },
  { value: 'received', label: 'Received' },
  { value: 'returned', label: 'Returned' },
  { value: 'rejected', label: 'Rejected' },
];

export const IMPORT_RECEIPT_STATUS_COLOR: Record<
  string,
  'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary'
> = {
  requested: 'info',
  approved: 'primary',
  processing: 'warning',
  received: 'success',
  returned: 'secondary',
  rejected: 'error',
};

export const EQUIPMENT_STATUS_COLOR: Record<
  string,
  'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary'
> = {
  available: 'success',
  in_use: 'primary',
  under_maintenance: 'warning',
  out_of_service: 'error',
  liquidation: 'secondary',
  reserved: 'info',
  pending_transfer: 'warning',
};
