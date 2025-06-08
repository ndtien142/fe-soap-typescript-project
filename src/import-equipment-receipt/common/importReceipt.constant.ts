export const TABLE_HEAD_IMPORT_RECEIPTS = [
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'dateOfOrder', label: 'Ngày đặt hàng', align: 'left' },
  { id: 'dateOfReceived', label: 'Ngày dự kiến nhận', align: 'left' },
  { id: 'dateOfActualReceived', label: 'Ngày nhận thực tế', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left' },
  { id: 'supplier', label: 'Nhà cung cấp', align: 'left' },
  { id: 'requestedUser', label: 'Người yêu cầu', align: 'left' },
  { id: 'note', label: 'Ghi chú', align: 'left' },
  { id: '', label: '' },
];

export const IMPORT_RECEIPT_STATUS_OPTIONS = [
  { value: 'requested', label: 'Requested' },
  { value: 'approved', label: 'Approved' },
  { value: 'processing', label: 'Processing' },
  { value: 'received', label: 'Received' },
  { value: 'returned', label: 'Returned' },
  { value: 'rejected', label: 'Rejected' },
];
