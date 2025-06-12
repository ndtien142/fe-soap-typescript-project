import { useCallback, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel } from '@mui/material';
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from 'src/common/components/hook-form';
import Label from 'src/common/components/Label';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import useShowSnackbar from 'src/common/hooks/useMessage';
import useCreateDepartment from 'src/management-department/common/hooks/useCreateDepartment';
import { useBlockDepartment } from 'src/management-department/common/hooks/useBlockDepartment';
import { IDepartment } from 'src/common/@types/department/department.interface';

interface FormValuesProps extends Omit<IDepartment, 'avatarUrl'> {
  roleId: number;
  departmentName: string;
  description: string;
  isActive: boolean;
  managerId: string;  // Giả sử bạn có trường người quản lý
}

type Props = {
  isEdit: boolean;
  currentDepartment?: IDepartment;
};

export default function DepartmentNewEditForm({ isEdit, currentDepartment }: Props) {
  const navigate = useNavigate();

  const { showErrorSnackbar, showSuccessSnackbar } = useShowSnackbar();
  const { mutate: updateDepartment } = useBlockDepartment({
    onError: () => {
      showErrorSnackbar('Cập nhật phòng ban thất bại');
    },
    onSuccess: () => {
      showSuccessSnackbar('Cập nhật phòng ban thành công');
      navigate(PATH_DASHBOARD.department.list);
    },
  });

  const { mutate: createDepartment } = useCreateDepartment({
    onError: () => {
      showSuccessSnackbar('Tạo phòng ban mới thất bại');
      navigate(PATH_DASHBOARD.department.list);
    },
    onSuccess: () => {
      showSuccessSnackbar('Tạo phòng ban mới thành công');
      navigate(PATH_DASHBOARD.department.list);
    },
  });

  // Các giá trị mặc định cho form, sử dụng dữ liệu phòng ban hiện tại nếu có
  const defaultValues = useMemo(
    () => ({
      departmentId: currentDepartment?.departmentId || '',
      departmentName: currentDepartment?.departmentName || '',
      description: currentDepartment?.description || '',
      isActive: currentDepartment?.isActive || false,
    }),
    [currentDepartment]
  );

  const methods = useForm<FormValuesProps>({
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentDepartment) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentDepartment]);

  // Xử lý khi submit form
  const onSubmit = async (data: FormValuesProps) => {
    // if (isEdit) {
    //   // Cập nhật thông tin phòng ban
    //   updateDepartment({ departmentId: data.departmentId, isActive: data.isActive });
    // } else {
    //   // Tạo mới phòng ban
    //   createDepartment(data);
    // }
  };

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

            <Box sx={{ mb: 5 }}></Box>
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
              
              {/* Trường người quản lý */}
              <RHFSelect name="managerId" label="Người quản lý" placeholder="Chọn người quản lý">
                <option value="" />
                {/* Thêm các tùy chọn người quản lý */}
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
