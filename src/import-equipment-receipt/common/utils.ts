import { IImportReceipt } from 'src/common/@types/import-receipt/import-receipt.interface';

export function applySortFilterImportReceipts({
  tableData,
  comparator,
  filterCode,
  filterSupplier,
  filterStatus,
}: {
  tableData: IImportReceipt[];
  comparator: (a: any, b: any) => number;
  filterCode: string;
  filterSupplier: string;
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

  // 2. Lọc theo mã phiếu (hoặc 1 phần)
  if (filterCode) {
    const searchLower = filterCode.toLowerCase();
    filteredData = filteredData.filter((item: IImportReceipt) =>
      item.id.toString().includes(searchLower)
    );
  }

  // 3. Lọc theo nhà cung cấp
  if (filterSupplier) {
    const searchLower = filterSupplier.toLowerCase();
    filteredData = filteredData.filter((item: IImportReceipt) =>
      item.supplier.name.toLowerCase().includes(searchLower)
    );
  }

  // 4. Lọc theo trạng thái
  if (filterStatus) {
    const searchLower = filterStatus.toLowerCase();
    filteredData = filteredData.filter(
      (item: IImportReceipt) => item.status.toLowerCase() === searchLower
    );
  }

  return filteredData;
}
