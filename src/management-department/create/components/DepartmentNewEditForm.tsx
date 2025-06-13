import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';

import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from 'src/common/components/hook-form';

import Label from 'src/common/components/Label';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import useShowSnackbar from 'src/common/hooks/useMessage';
import useCreateDepartment from 'src/management-department/common/hooks/useCreateDepartment';
import { useBlockDepartment } from 'src/management-department/common/hooks/useBlockDepartment';
import { IDepartment } from 'src/common/@types/department/department.interface';
import { CustomFile } from 'src/common/components/upload';
import { fData } from 'src/common/utils/formatNumber';


const DepartmentSchema = Yup.object().shape({
  departmentName: Yup.string().required('Vui lòng nhập tên phòng ban'),
  description: Yup.string().required('Vui lòng nhập mô tả'),
  managerId: Yup.string().required('Vui lòng chọn người quản lý'),
});

interface FormValuesProps extends Omit<IDepartment, 'avatarUrl'> {
  avatarUrl: CustomFile | string | null;
  departmentId: string;
  departmentName: string;
  description: string;
  isActive: boolean;
  managerId: string;
}

type Props = {
  isEdit: boolean;
  currentDepartment?: IDepartment;
};

export default function DepartmentNewEditForm({ isEdit, currentDepartment }: Props) {
  const navigate = useNavigate();
  const { showErrorSnackbar, showSuccessSnackbar } = useShowSnackbar();

  const { mutate: updateDepartment } = useBlockDepartment({
    onError: () => showErrorSnackbar('Cập nhật phòng ban thất bại'),
    onSuccess: () => {
      showSuccessSnackbar('Cập nhật phòng ban thành công');
      navigate(PATH_DASHBOARD.department.list);
    },
  });

  const { mutate: createDepartment } = useCreateDepartment({
    onError: () => {
      showErrorSnackbar('Tạo phòng ban mới thất bại');
      navigate(PATH_DASHBOARD.department.list);
    },
    onSuccess: () => {
      showSuccessSnackbar('Tạo phòng ban mới thành công');
      navigate(PATH_DASHBOARD.department.list);
    },
  });

  const defaultValues = useMemo(
    () => ({
      departmentId: currentDepartment?.departmentId || '',
      departmentName: currentDepartment?.departmentName || '',
      description: currentDepartment?.description || '',
      isActive: currentDepartment?.isActive || false,
      managerId: '',
    }),
    [currentDepartment]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(DepartmentSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    reset(defaultValues);
  }, [isEdit, currentDepartment, reset, defaultValues]);

  const onSubmit = async (data: FormValuesProps) => {
    if (isEdit) {
      updateDepartment({ departmentId: data.departmentId, isActive: data.isActive });
    } else {
      const payload = {
        name: data.departmentName,
        description: data.description,
        isActive: data.isActive,
        managerId: data.managerId,
      };
      createDepartment(payload);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'avatarUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            {isEdit && (
              <Label
                color={values.isActive ? 'success' : 'error'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.isActive ? 'Active' : 'Inactive'}
              </Label>
            )}
            <Box sx={{ mb: 5 }}>
                          <RHFUploadAvatar
                            name="avatarUrl"
                            maxSize={3145728}
                            onDrop={handleDrop}
                            helperText={
                              <Typography
                                variant="caption"
                                sx={{
                                  mt: 2,
                                  mx: 'auto',
                                  display: 'block',
                                  textAlign: 'center',
                                  color: 'text.secondary',
                                }}
                              >
                                Allowed *.jpeg, *.jpg, *.png, *.gif
                                <br /> max size of {fData(3145728)}
                              </Typography>
                            }
                          />
                        </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="departmentName" label="Tên phòng ban" />
              <RHFTextField name="description" label="Mô tả" />
              <RHFSelect name="managerId" label="Người quản lý" placeholder="Chọn người quản lý">
                <option value="" />
                <option value="manager1">Manager 1</option>
                <option value="manager2">Manager 2</option>
              </RHFSelect>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Tạo phòng ban mới' : 'Lưu thay đổi'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
