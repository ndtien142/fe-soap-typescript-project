export interface IEquipmentGroupDetail {
  code: string;
  name: string;
  description: string | null;
  unitOfMeasure: {
    id: number;
    name: string;
  };
  type: {
    id: number;
    name: string;
  };
  manufacturer: {
    id: number;
    name: string;
  };
  equipments: IEquipmentSerial[];
  isDeleted: boolean;
  isActive: boolean;
}

export interface IEquipmentSerial {
  serialNumber: string;
  description: string;
  location: string | null;
  status: 'in_use' | 'available' | string;
  dayOfFirstUse: string | null;
}

export interface IGetEquipmentGroupDetailResponse {
  message: string;
  status: number;
  metadata: {
    code: number;
    message: string;
    metadata: IEquipmentGroupDetail;
  };
}
