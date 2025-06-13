import { Transfer } from 'src/common/@types/transfer';

export function applyFilterTransfers({
  tableData,
  comparator,
  filterCode,
  filterStatus,
}: {
  tableData: Transfer[];
  comparator: (a: any, b: any) => number;
  filterCode: string;
  filterService: string;
  filterStatus: string;
}) {
  // Sort data
  const stabilizedThis = tableData.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  let filteredData = stabilizedThis.map((el) => el[0]);

  // Filter by code
  if (filterCode) {
    const searchLower = filterCode.toLowerCase();
    filteredData = filteredData.filter(
      (item: Transfer) =>
        item.transferNumber.toLowerCase().includes(searchLower) ||
        item.transferTo.name.toLowerCase().includes(searchLower)
    );
  }

  // Filter by status
  if (filterStatus) {
    filteredData = filteredData.filter(
      (item: Transfer) => item.status.toLowerCase() === filterStatus.toLowerCase()
    );
  }

  return filteredData;
}
