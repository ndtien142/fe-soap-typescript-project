export const LIQUIDATION_RECEIPT_STATUS_COLOR: Record<string, any> = {
  processing: 'primary',     // đang xử lý
  completed: 'success',      // đã thanh lý
  rejected: 'error',         // từ chối
};

export const TABLE_HEAD_LIQUIDATION_RECEIPTS = [
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'userCode', label: 'Người thanh lý', align: 'left' },
  { id: 'room', label: 'Phòng', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left' },
  { id: 'createdTime', label: 'Ngày tạo', align: 'left' },
  { id: 'liquidationDate', label: 'Ngày thanh lý', align: 'left' },
  { id: 'items', label: 'Thiết bị', align: 'left' },
  { id: 'note', label: 'Ghi chú', align: 'left' },
  { id: '' },
];
