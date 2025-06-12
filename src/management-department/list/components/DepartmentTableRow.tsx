import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
import Iconify from 'src/common/components/Iconify';
import Label from 'src/common/components/Label';
import { TableMoreMenu } from 'src/common/components/table';
import { IDepartment } from 'src/common/@types/department/department.interface';  // Import đúng kiểu IDepartment

type Props = {
  row: IDepartment;          // Kiểu dữ liệu của row là IDepartment
  selected: boolean;         // Kiểm tra xem dòng có được chọn không
  onEditRow: () => void;     // Hàm xử lý khi chỉnh sửa phòng ban
  onSelectRow: () => void;   // Hàm xử lý khi chọn dòng
  onDeleteRow: () => void;   // Hàm xử lý khi xóa phòng ban
};

export default function DepartmentTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const theme = useTheme();

  // Destructuring row để lấy các giá trị
  const { departmentId, departmentName, isActive, description } = row;

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={departmentName} src={''} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {departmentName}
        </Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {description || 'No description available'}
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={isActive ? 'success' : 'error'}  // Sử dụng `isActive` thay vì `status`
          sx={{ textTransform: 'capitalize' }}
        >
          {isActive ? 'Active' : 'Inactive'}  // Hiển thị 'Active' hoặc 'Inactive' tùy theo `isActive`
        </Label>
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onDeleteRow();   // Xử lý xóa
                  handleCloseMenu(); // Đóng menu sau khi xóa
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onEditRow();  // Xử lý chỉnh sửa
                  handleCloseMenu(); // Đóng menu sau khi chỉnh sửa
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
