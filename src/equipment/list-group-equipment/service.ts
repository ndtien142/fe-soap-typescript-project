import { API_EQUIPMENT_GROUP } from 'src/common/constant/api.constant';
import axiosInstance from 'src/common/utils/axios';
import { IGroupEquipmentParams, IGroupEquipmentResponse } from './equipmentGroup.interface';

export const getListEquipmentGroup = (params: IGroupEquipmentParams) =>
  axiosInstance.get<unknown, IGroupEquipmentResponse>(API_EQUIPMENT_GROUP, {
    params,
  });
