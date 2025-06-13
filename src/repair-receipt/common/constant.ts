export const REPAIR_RECEIPT_STATUS_COLOR: Record<string, any> = {
  requested: 'warning',     // yêu cầu
  in_progress: 'primary',   // đang sửa chữa
  completed: 'success',     // đã hoàn thành
  cancelled: 'error',       // đã huỷ
};

export const TABLE_HEAD_REPAIR_RECEIPTS = [
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'userCode', label: 'Người yêu cầu', align: 'left' },
  { id: 'room', label: 'Phòng', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left' },
  { id: 'createdAt', label: 'Ngày tạo', align: 'left' },
  { id: 'repairDate', label: 'Ngày sửa chữa', align: 'left' },
  { id: 'items', label: 'Thiết bị', align: 'left' },
  { id: 'note', label: 'Ghi chú', align: 'left' },
  { id: '' }, // for actions (view/edit/delete)
];

