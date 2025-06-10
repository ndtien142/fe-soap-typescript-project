import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Stack, Button, Typography, Divider, MenuItem, CircularProgress } from '@mui/material';
import Iconify from 'src/common/components/Iconify';
import { useEffect } from 'react';
import { RHFSelect, RHFTextField } from 'src/common/components/hook-form';
import { useGetListEquipmentGroup } from 'src/equipment/list-group-equipment/hooks/useGetListGroupEquipment';

// ----------------------------------------------------------------------

export default function BorrowNewEditDetails() {
  const { control, setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'groups' });
  const values = watch();

  // Fetch group equipment options
  const {
    data: groupOptions,
    isLoading,
    fetchData,
  } = useGetListEquipmentGroup({ onSuccess: () => {}, onError: () => {} });

  useEffect(() => {
    fetchData({ page: 1, limit: 100 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Danh sách nhóm thiết bị mượn
      </Typography>
      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => (
          <Stack key={item.id} direction="row" spacing={2} alignItems="center">
            <Controller
              name={`groups.${index}.groupEquipmentCode`}
              control={control}
              render={({ field }) => (
                <RHFSelect
                  {...field}
                  label="Nhóm thiết bị"
                  sx={{ minWidth: 180 }}
                  disabled={isLoading}
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                >
                  <MenuItem value="">Chọn nhóm</MenuItem>
                  {isLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={16} />
                    </MenuItem>
                  ) : (
                    groupOptions?.map((opt: any) => (
                      <MenuItem key={opt.code} value={opt.code}>
                        {opt.name}
                      </MenuItem>
                    ))
                  )}
                </RHFSelect>
              )}
            />
            <Controller
              name={`groups.${index}.quantity`}
              control={control}
              render={({ field }) => (
                <RHFTextField {...field} type="number" label="Số lượng" sx={{ width: 100 }} />
              )}
            />
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="eva:trash-2-outline" />}
              onClick={() => remove(index)}
            >
              Xóa
            </Button>
          </Stack>
        ))}
      </Stack>
      <Button
        size="small"
        startIcon={<Iconify icon="eva:plus-fill" />}
        onClick={() => append({ groupEquipmentCode: '', quantity: 1 })}
        sx={{ mt: 2 }}
      >
        Thêm nhóm thiết bị
      </Button>
    </Stack>
  );
}
