import {
  API_EQUIPMENT_GROUP,
  API_EQUIPMENT_MANUFACTURER,
  API_EQUIPMENT_TYPE,
  API_UNIT_OF_MEASURE,
} from 'src/common/constant/api.constant';
import axiosInstance from 'src/common/utils/axios';
import { ISimpleParams } from 'src/common/@types/common.interface';
import { IListManufacturerResponse } from 'src/common/@types/equipment/manufacturer.interface';
import { IListEquipmentTypeResponse } from 'src/common/@types/equipment/equipmentType.interface';

import {
  IGroupEquipmentParams,
  IGroupEquipmentResponse,
} from '../list-group-equipment/equipmentGroup.interface';
import { IListUnitOfMeasureResponse } from 'src/common/@types/equipment/unitOfMeasure.interface';

export const getListEquipmentGroup = (params: IGroupEquipmentParams) =>
  axiosInstance.get<unknown, IGroupEquipmentResponse>(API_EQUIPMENT_GROUP, {
    params,
  });

export const getListEquipmentManufacturer = (params: ISimpleParams) =>
  axiosInstance.get<unknown, IListManufacturerResponse>(API_EQUIPMENT_MANUFACTURER, { params });

export const getListTypeEquipment = (params: ISimpleParams) =>
  axiosInstance.get<unknown, IListEquipmentTypeResponse>(API_EQUIPMENT_TYPE, { params });

export const getListUnitOfMeasure = (params: ISimpleParams) =>
  axiosInstance.get<unknown, IListUnitOfMeasureResponse>(API_UNIT_OF_MEASURE, { params });
