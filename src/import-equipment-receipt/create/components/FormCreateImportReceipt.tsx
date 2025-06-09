import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, TextField, Typography, Autocomplete, Button } from '@mui/material';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import { FormProvider, RHFEditor, RHFTextField } from 'src/common/components/hook-form';
import Iconify from 'src/common/components/Iconify';
import { IFormImportReceiptProps, ImportReceiptFormValues } from '../interface';
import { useGetListSuppliers } from 'src/import-equipment-receipt/common/hooks/useGetListSupplier';
import { useGetListEquipmentGroup } from 'src/equipment/list-group-equipment/hooks/useGetListGroupEquipment';
import axiosInstance from 'src/common/utils/axios';
import { API_IMPORT_RECEIPT } from 'src/common/constant/api.constant';
import { default as useMessage } from 'src/common/hooks/useMessage';

const LabelStyle = (props: any) => (
  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
    {props.children}
  </Typography>
);

export default function FormCreateImportReceipt({
  isEdit = false,
  currentReceipt,
}: IFormImportReceiptProps) {
  const navigate = useNavigate();
  const { showErrorSnackbar, showSuccessSnackbar } = useMessage();
  const {
    data: suppliers,
    isLoading: isLoadingSuppliers,
    fetchData: fetchSuppliers,
  } = useGetListSuppliers({ onError: () => {}, onSuccess: () => {} });

  const {
    data: equipmentGroups,
    isLoading: isLoadingEquipmentGroups,
    fetchData: fetchEquipmentGroups,
  } = useGetListEquipmentGroup({ onError: () => {}, onSuccess: () => {} });

  const Schema = Yup.object().shape({
    name: Yup.string().required('Tên phiếu nhập là bắt buộc'),
    supplier: Yup.object({
      id: Yup.number().required('Supplier is required'),
    }),
    dateOfReceived: Yup.string().required('Date of received is required'),
    dateOfOrder: Yup.string().required('Date of order is required'),
    note: Yup.string(),
    items: Yup.array()
      .of(
        Yup.object().shape({
          code: Yup.string().required('Code is required'),
          price: Yup.number()
            .typeError('Giá thiết bị là bắt buộc')
            .required('Giá thiết bị là bắt buộc')
            .moreThan(0, 'Giá thiết bị phải lớn hơn 0'),
          quantity: Yup.number()
            .typeError('Số lượng là bắt buộc')
            .required('Số lượng là bắt buộc')
            .min(1, 'Quantity must be at least 1'),
        })
      )
      .min(1, 'Vui lòng nhập ít nhất 1 thiết bị')
      .required('Vui lòng nhập ít nhất 1 thiết bị'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentReceipt?.name || '',
      supplier: { id: currentReceipt?.supplier?.id ?? null },
      supplierAddress: currentReceipt?.supplierAddress || '',
      supplierPhone: currentReceipt?.supplierPhone || '',
      supplierEmail: currentReceipt?.supplierEmail || '',
      dateOfReceived: currentReceipt?.dateOfReceived || '',
      dateOfOrder: currentReceipt?.dateOfOrder || '',
      note: currentReceipt?.note || '',
      items: currentReceipt?.items || [],
    }),
    [currentReceipt]
  );

  const methods = useForm<ImportReceiptFormValues>({
    resolver: yupResolver(Schema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    watch,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  console.log('Form values:', getValues());

  // Reset form when edit or create new
  useEffect(() => {
    reset(defaultValues);
  }, [isEdit, currentReceipt, reset, defaultValues]);

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchSuppliers({
      page: 1,
      limit: 20,
    });
  }, []);

  useEffect(() => {
    fetchEquipmentGroups({
      page: 1,
      limit: 20,
      searchText: searchText,
    });
  }, [searchText]);

  console.log(equipmentGroups);
  console.log(suppliers);

  const onSubmit = async (data: ImportReceiptFormValues) => {
    try {
      const requestBody = {
        name: data.name,
        supplier: { id: data.supplier.id ?? 0 },
        items: data.items.map((item) => ({
          code: item.code,
          price: item.price,
          quantity: item.quantity,
        })),
        dateOfReceived: data.dateOfReceived,
        dateOfOrder: data.dateOfOrder,
        note: data.note,
      };

      const response = await axiosInstance.post(API_IMPORT_RECEIPT, requestBody);

      if (response.status === 201 || response.status === 200) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        showSuccessSnackbar(!isEdit ? 'Create success!' : 'Update success!');
        navigate(PATH_DASHBOARD.importReceipt.list);
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
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <LabelStyle>Thông tin phiếu nhập</LabelStyle>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Tên phiếu nhập" />
              <Stack
                spacing={3}
                direction={'row'}
                justifyContent="space-between"
                alignItems={'center'}
              >
                <RHFTextField
                  name="dateOfOrder"
                  label="Ngày đặt hàng"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
                <RHFTextField
                  name="dateOfReceived"
                  label="Ngày nhận hàng"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
              <div>
                <LabelStyle>Ghi chú</LabelStyle>
                <RHFEditor simple name="note" />
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, mb: 3 }}>
            <LabelStyle>Nhà cung cấp</LabelStyle>
            <Stack spacing={2}>
              <Controller
                name="supplier.id"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={suppliers}
                    getOptionLabel={(option) => option.name || ''}
                    value={suppliers.find((s) => s.id === field.value) || null}
                    onChange={(_, newValue) => {
                      setValue('supplier.id', newValue?.id ?? null);
                      setValue('supplierAddress', newValue?.address ?? '');
                      setValue('supplierPhone', newValue?.phone ?? '');
                      setValue('supplierEmail', newValue?.email ?? '');
                    }}
                    renderInput={(params) => <TextField {...params} label="Chọn nhà cung cấp" />}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                  />
                )}
              />
              <RHFTextField
                name="supplierAddress"
                label="Địa chỉ"
                disabled
                InputLabelProps={{ shrink: true }}
              />
              <RHFTextField
                name="supplierPhone"
                label="Số điện thoại"
                disabled
                InputLabelProps={{ shrink: true }}
              />
              <RHFTextField
                name="supplierEmail"
                label="Email"
                disabled
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </Card>
          <Card sx={{ p: 3 }}>
            <LabelStyle>Tổng tiền</LabelStyle>
            <Stack spacing={3}>
              <TextField
                label="Tổng tiền"
                value={
                  methods
                    .watch('items')
                    .reduce((sum, item) => {
                      let price = 0;
                      if (typeof item.price === 'string') {
                        price = Number((item.price as string).replace(/[^0-9]/g, ''));
                      } else if (typeof item.price === 'number') {
                        price = item.price;
                      }
                      return sum + (price || 0) * (Number(item.quantity) || 0);
                    }, 0)
                    .toLocaleString('vi-VN') + ' ₫'
                }
                InputProps={{
                  readOnly: true,
                }}
              />
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <LabelStyle>Danh sách thiết bị</LabelStyle>
            <Autocomplete
              options={equipmentGroups || []}
              getOptionLabel={(option) => option?.name || ''}
              isOptionEqualToValue={(option, value) => option.code === value.code}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tìm kiếm thiết bị nhập vào"
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                />
              )}
              onInputChange={(_, value) => setSearchText(value)}
              onChange={(_, newValue) => {
                if (newValue && newValue.code) {
                  append({
                    code: newValue.code,
                    price: 0,
                    quantity: 1,
                  });
                }
              }}
            />
            {fields.map((item, index) => (
              <Stack
                key={item.id}
                spacing={2}
                mt={2}
                p={2}
                border="1px solid #ddd"
                borderRadius={1}
              >
                <Typography variant="subtitle2">Thiết bị: {item.code}</Typography>
                <Stack direction="row" spacing={2}>
                  <RHFTextField name={`items.${index}.code`} label="Code thiết bị" />
                  <RHFTextField
                    name={`items.${index}.price`}
                    label="Giá"
                    type="number"
                    InputProps={{
                      inputProps: { min: 0 },
                      startAdornment: <span style={{ marginRight: 4 }}>₫</span>,
                    }}
                    // Format value as currency on blur
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      if (value) {
                        const number = Number(value.replace(/[^0-9]/g, ''));
                        e.target.value = number.toLocaleString('vi-VN');
                      }
                    }}
                    helperText={
                      methods.formState.errors.items?.[index]?.price
                        ? (methods.formState.errors.items?.[index]?.price?.message as string)
                        : ''
                    }
                    error={!!methods.formState.errors.items?.[index]?.price}
                  />
                  <RHFTextField
                    name={`items.${index}.quantity`}
                    label="Số lượng"
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                    helperText={
                      methods.formState.errors.items?.[index]?.quantity
                        ? (methods.formState.errors.items?.[index]?.quantity?.message as string)
                        : ''
                    }
                    error={!!methods.formState.errors.items?.[index]?.quantity}
                  />
                  <Button color="error" variant="outlined" onClick={() => remove(index)}>
                    <Iconify icon="eva:trash-2-outline" />
                  </Button>
                </Stack>
              </Stack>
            ))}
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3} mt={3}>
            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Tạo phiếu nhập' : 'Lưu thay đổi'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
