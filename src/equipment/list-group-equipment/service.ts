import {
  API_EQUIPMENT_GROUP,
  API_EQUIPMENT_MANUFACTURER,
  API_EQUIPMENT_TYPE,
} from 'src/common/constant/api.constant';
import axiosInstance from 'src/common/utils/axios';
import { IGroupEquipmentParams, IGroupEquipmentResponse } from './equipmentGroup.interface';
import { ISimpleParams } from 'src/common/@types/common.interface';
import { IListManufacturerResponse } from 'src/common/@types/equipment/manufacturer.interface';
import { IListEquipmentTypeResponse } from 'src/common/@types/equipment/equipmentType.interface';

export const getListEquipmentGroup = (params: IGroupEquipmentParams) =>
  axiosInstance.get<unknown, IGroupEquipmentResponse>(API_EQUIPMENT_GROUP, {
    params,
  });

export const getListEquipmentManufacturer = (params: ISimpleParams) =>
  axiosInstance.get<unknown, IListManufacturerResponse>(API_EQUIPMENT_MANUFACTURER, { params });

export const getListTypeEquipment = (params: ISimpleParams) =>
  axiosInstance.get<unknown, IListEquipmentTypeResponse>(API_EQUIPMENT_TYPE, { params });
