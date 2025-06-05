// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../common/routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../common/components/Page';
import HeaderBreadcrumbs from '../../common/components/HeaderBreadcrumbs';
// sections
import ProductNewEditForm from '../../sections/@dashboard/e-commerce/ProductNewEditForm';

// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Ecommerce: Create a new product">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Create a new product"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'New product' },
          ]}
        />
        <ProductNewEditForm />
      </Container>
    </Page>
  );
}
