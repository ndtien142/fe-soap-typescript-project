import { IGroupEquipment } from './equipmentGroup.interface';

export function applySortFilter({
  tableData,
  comparator,
  filterNameOrCode,
  filterManufacturer,
  filterType,
}: {
  tableData: IGroupEquipment[];
  comparator: (a: any, b: any) => number;
  filterNameOrCode: string;
  filterManufacturer: string;
  filterType: string;
}) {
  // 1. Sắp xếp dữ liệu
  const stabilizedThis = tableData.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  let filteredData = stabilizedThis.map((el) => el[0]);

  // 2. Lọc theo tên hoặc mã thiết bị
  if (filterNameOrCode) {
    const searchLower = filterNameOrCode.toLowerCase();
    filteredData = filteredData.filter(
      (item: IGroupEquipment) =>
        item.name.toLowerCase().includes(searchLower) ||
        item.code.toLowerCase().includes(searchLower)
    );
  }

  // 3. Lọc theo hãng (nếu được chọn)
  if (filterManufacturer) {
    filteredData = filteredData.filter(
      (item: IGroupEquipment) =>
        item.manufacturer.name.toLowerCase() === filterManufacturer.toLowerCase()
    );
  }

  // 4. Lọc theo loại (nếu được chọn)
  if (filterType) {
    filteredData = filteredData.filter(
      (item: IGroupEquipment) => item.type.name.toLowerCase() === filterType.toLowerCase()
    );
  }

  return filteredData;
}
