export const BORROW_RECEIPT_STATUS_COLOR: Record<string, any> = {
  requested: 'warning',
  approved: 'info',
  processing: 'primary',
  rejected: 'error',
  returned: 'success',
  borrowed: 'secondary',
};

export const TABLE_HEAD_BORROW_RECEIPTS = [
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'requestedBy', label: 'Người yêu cầu', align: 'left' },
  { id: 'room', label: 'Phòng', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left' },
  { id: 'createdTime', label: 'Ngày tạo', align: 'left' },
  { id: 'borrowDate', label: 'Ngày bàn giao', align: 'left' },
  { id: 'requestItems', label: 'Thiết bị', align: 'left' },
  { id: 'note', label: 'Ghi chú', align: 'left' },
  { id: '' },
];
