import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { default as useMessage } from 'src/common/hooks/useMessage';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { FormProvider, RHFTextField, RHFSelect } from 'src/common/components/hook-form';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import { useGetListManufacturer } from 'src/equipment/common/hooks/useGetListManufacture';
import { useGetListEquipmentType } from 'src/equipment/common/hooks/useGetListTypeEquipment';
import { useGetUnitOfMeasure } from 'src/equipment/common/hooks/useGetUnitOfMeasure';
import { GroupEquipmentSchema } from '../groupEquipment.schema';
import axiosInstance from 'src/common/utils/axios';
import { API_EQUIPMENT_GROUP } from 'src/common/constant/api.constant';

interface ISelectOption {
  id: number;
  name: string;
}

interface IFormGroupEquipment {
  id?: number;
  name: string;
  description?: string;
  manufacturer: ISelectOption;
  type: ISelectOption;
  unit: ISelectOption;
}

type Props = {
  isEdit: boolean;
  currentGroupEquipment?: IFormGroupEquipment;
};

export default function GroupEquipmentNewEditForm({ isEdit, currentGroupEquipment }: Props) {
  const navigate = useNavigate();

  const { showErrorSnackbar, showSuccessSnackbar } = useMessage();

  const { data: manufacturers, fetchData: fetchManufacturers } = useGetListManufacturer({
    onSuccess: () => {
      showSuccessSnackbar('Fetched manufacturers successfully!');
    },
    onError: () => {
      showErrorSnackbar('Failed to fetch manufacturers');
    },
  });

  const { data: equipmentType, fetchData: fetchEquipmentType } = useGetListEquipmentType({
    onSuccess: () => {
      showSuccessSnackbar('Fetched equipment types successfully!');
    },
    onError: () => {
      showErrorSnackbar('Failed to fetch equipment types');
    },
  });

  const { data: unitOfMeasure, fetchData: fetchUnitOfMeasure } = useGetUnitOfMeasure({
    onSuccess: () => {
      showSuccessSnackbar('Fetched unit of measure successfully!');
    },
    onError: () => {
      showErrorSnackbar('Failed to fetch unit of measure');
    },
  });

  useEffect(() => {
    fetchManufacturers({ page: 1, limit: 20 });
    fetchEquipmentType({ page: 1, limit: 20 });
    fetchUnitOfMeasure({ page: 1, limit: 20 });
  }, []);

  const defaultValues = useMemo(
    () => ({
      name: currentGroupEquipment?.name || '',
      description: currentGroupEquipment?.description || '',
      manufacturer: currentGroupEquipment?.manufacturer || { id: 0, name: '' },
      type: currentGroupEquipment?.type || { id: 0, name: '' },
      unit: currentGroupEquipment?.unit || { id: 0, name: '' },
    }),
    [currentGroupEquipment]
  );

  const methods = useForm<IFormGroupEquipment>({
    resolver: yupResolver(GroupEquipmentSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    formState: { errors },
  } = methods;

  console.log('Form errors:', errors);

  useEffect(() => {
    if (isEdit && currentGroupEquipment) {
      reset(defaultValues);
    } else {
      reset(defaultValues);
    }
  }, [isEdit, currentGroupEquipment, reset, defaultValues]);

  const onSubmit = async (data: IFormGroupEquipment) => {
    try {
      const payload = {
        ...data,
        manufacturer: { id: data.manufacturer.id, name: data.manufacturer.name },
        type: { id: data.type.id, name: data.type.name },
        unitOfMeasure: { id: data.unit.id, name: data.unit.name },
      };

      console.log('Payload to BE:', payload);

      const response = await axiosInstance.post(API_EQUIPMENT_GROUP, { ...payload });

      if (response.status === 201) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        showSuccessSnackbar(!isEdit ? 'Created successfully!' : 'Updated successfully!');
        navigate(PATH_DASHBOARD.equipment.listGroup);
      } else {
        showErrorSnackbar('Unexpected response status');
      }
    } catch (error) {
      console.error(error);
      showErrorSnackbar('Failed to submit data. Please try again!');
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="name" label="Name" />

              <RHFSelect
                name="manufacturer.id"
                label="Manufacturer"
                placeholder="Select Manufacturer"
                onChange={(e) => {
                  const selected = manufacturers?.find(
                    (item) => item.id === Number(e.target.value)
                  );
                  setValue('manufacturer', selected || { id: 0, name: '' });
                }}
              >
                <option value="" />
                {manufacturers?.map((item: ISelectOption) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect
                name="type.id"
                label="Type"
                placeholder="Select Type"
                onChange={(e) => {
                  const selected = equipmentType?.find(
                    (item) => item.id === Number(e.target.value)
                  );
                  setValue('type', selected || { id: 0, name: '' });
                }}
              >
                <option value="" />
                {equipmentType?.map((item: ISelectOption) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect
                name="unit.id"
                label="Unit"
                placeholder="Select Unit"
                onChange={(e) => {
                  const selected = unitOfMeasure?.find(
                    (item) => item.id === Number(e.target.value)
                  );
                  setValue('unit', selected || { id: 0, name: '' });
                }}
              >
                <option value="" />
                {unitOfMeasure?.map((item: ISelectOption) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </RHFSelect>
            </Box>
            <Box mt={3}>
              <RHFTextField name="description" label="Description" multiline rows={3} />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Group Equipment' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
