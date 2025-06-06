export const mockEquipmentResponse = {
  message: 'Get all equipment successfully',
  status: 200,
  metadata: {
    code: 200,
    message: 'Get all group equipment successfully',
    metadata: [
      {
        code: 'MAYTINH-DELL-2025',
        name: 'Máy tính DELL',
        unitOfMeasure: {
          id: 1,
          name: 'chiếc',
        },
        type: {
          id: 1,
          name: 'Máy tính',
        },
        manufacturer: {
          id: 2,
          name: 'HÃNG DELL',
        },
        equipmentStatusCounts: {},
        isDeleted: false,
        isActive: true,
      },
      {
        code: 'MAYTINH-HP-2025',
        name: 'Máy tính HP',
        unitOfMeasure: {
          id: 1,
          name: 'chiếc',
        },
        type: {
          id: 1,
          name: 'Máy tính',
        },
        manufacturer: {
          id: 1,
          name: 'HÃNG HP',
        },
        equipmentStatusCounts: {},
        isDeleted: false,
        isActive: true,
      },
      {
        code: 'MAYTINH-MAC-2025',
        name: 'Máy tính MAC',
        unitOfMeasure: {
          id: 1,
          name: 'chiếc',
        },
        type: {
          id: 1,
          name: 'Máy tính',
        },
        manufacturer: {
          id: 3,
          name: 'HÃNG MAC',
        },
        equipmentStatusCounts: {
          in_use: 5,
          available: 5,
        },
        isDeleted: false,
        isActive: true,
      },
    ],
    meta: {
      currentPage: 1,
      itemPerPage: 20,
      totalItems: 3,
      totalPages: 1,
    },
  },
};

// 👇 Dùng thử: log ra console
console.log(mockEquipmentResponse.metadata.metadata); // Mảng thiết bị


export const TABLE_HEAD_GROUP_EQUIPMENT = [
  { id: 'code', label: 'Mã thiết bị', align: 'left' },
  { id: 'name', label: 'Tên thiết bị', align: 'left' },
  { id: 'unitOfMeasure', label: 'Đơn vị đo', align: 'left' },
  { id: 'type', label: 'Loại thiết bị', align: 'left' },
  { id: 'manufacturer', label: 'Hãng sản xuất', align: 'left' },
  { id: 'equipmentStatus', label: 'Trạng thái sử dụng', align: 'left' },
  { id: 'isActive', label: 'Trạng thái', align: 'center', width: 120 },
  { id: ''},
];

