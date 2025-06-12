import { capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { Container } from '@mui/material';
import Page from 'src/common/components/Page';
import HeaderBreadcrumbs from 'src/common/components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from 'src/common/routes/paths';
import useSettings from 'src/common/hooks/useSettings';
import DepartmentNewEditForm from './components/DepartmentNewEditForm';
import useGetDepartment from '../common/hooks/useGetDepartment';

export default function DepartmentCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  // Lấy giá trị 'departmentId' từ URL params (trong trường hợp chỉnh sửa phòng ban)
  const { departmentId = '' } = useParams<{ departmentId: string }>();

  // Kiểm tra xem đang ở chế độ chỉnh sửa hay tạo mới
  const isEdit = pathname.includes('edit');

  // Lấy dữ liệu phòng ban nếu ở chế độ chỉnh sửa
  const { data, isLoading, isError } = useGetDepartment(departmentId);

  // Nếu có lỗi hoặc đang tải dữ liệu, hiển thị thông báo
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading department data.</div>;
  }

  return (
    <Page title={isEdit ? "Department: Edit department" : "Department: Create a new department"}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new department' : 'Edit department'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Department', href: PATH_DASHBOARD.department.list },
            { name: !isEdit ? 'New department' : capitalCase(departmentId) },
          ]}
        />

        <DepartmentNewEditForm isEdit={isEdit} currentDepartment={data?.metadata} />
      </Container>
    </Page>
  );
}
