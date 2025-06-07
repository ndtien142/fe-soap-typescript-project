import * as Yup from 'yup';

export const GroupEquipmentSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string(),
  manufacturer: Yup.object().shape({
    id: Yup.number().moreThan(0, 'Manufacturer is required').required('Manufacturer is required'),
    name: Yup.string(),
  }),
  type: Yup.object().shape({
    id: Yup.number().moreThan(0, 'Type is required').required('Type is required'),
    name: Yup.string(),
  }),
  unit: Yup.object().shape({
    id: Yup.number().moreThan(0, 'Unit is required').required('Unit is required'),
    name: Yup.string(),
  }),
});
