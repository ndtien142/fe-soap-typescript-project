import { IBorrowReceipt } from 'src/common/@types/borrow-receipt/borrowReceipt.interface';

export function applySortFilterBorrowReceipts({
  tableData,
  comparator,
  filterUser,
  filterRoom,
  filterStatus,
}: {
  tableData: IBorrowReceipt[];
  comparator: (a: any, b: any) => number;
  filterUser: string;
  filterRoom: string;
  filterStatus: string;
}) {
  // 1. Sắp xếp dữ liệu
  const stabilizedThis = tableData.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  let filteredData = stabilizedThis.map((el) => el[0]);

  // 2. Lọc theo người yêu cầu
  if (filterUser) {
    const searchLower = filterUser.toLowerCase();
    filteredData = filteredData.filter((item: IBorrowReceipt) =>
      item.requestedBy.username.toLowerCase().includes(searchLower)
    );
  }

  // 3. Lọc theo phòng
  if (filterRoom) {
    const searchLower = filterRoom.toLowerCase();
    filteredData = filteredData.filter((item: IBorrowReceipt) =>
      item.room.roomName.toLowerCase().includes(searchLower)
    );
  }

  // 4. Lọc theo trạng thái
  if (filterStatus) {
    const searchLower = filterStatus.toLowerCase();
    filteredData = filteredData.filter(
      (item: IBorrowReceipt) => item.status.toLowerCase() === searchLower
    );
  }

  return filteredData;
}
