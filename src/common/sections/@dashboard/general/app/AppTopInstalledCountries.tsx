// @mui
import { styled } from '@mui/material/styles';
import { Card, CardHeader, Typography, Stack, StackProps, CardProps } from '@mui/material';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';

// ----------------------------------------------------------------------

const ItemBlockStyle = styled((props: StackProps) => (
  <Stack direction="row" alignItems="center" {...props} />
))({
  minWidth: 72,
  flex: '1 1',
});

const ItemIconStyle = styled(Iconify)(({ theme }) => ({
  width: 16,
  height: 16,
  marginRight: theme.spacing(0.5),
  color: theme.palette.text.disabled,
}));

// ----------------------------------------------------------------------

type ItemProps = {
  id: string;
  name: string;
  android: number;
  windows: number;
  apple: number;
  flag: string;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: ItemProps[];
}

export default function AppTopInstalledCountries({ title, subheader, list, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3 }}>
          {list.map((country) => (
            <CountryItem key={country.id} country={country} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

type CountryItemProps = {
  country: ItemProps;
};

function CountryItem({ country }: CountryItemProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <ItemBlockStyle sx={{ minWidth: 120 }}>
        <Image disabledEffect alt={country.name} src={country.flag} sx={{ width: 28, mr: 1 }} />
        <Typography variant="subtitle2">{country.name}</Typography>
      </ItemBlockStyle>

      <ItemBlockStyle>
        <ItemIconStyle icon={'ant-design:android-filled'} />
        <Typography variant="body2">{fShortenNumber(country.android)}</Typography>
      </ItemBlockStyle>

      <ItemBlockStyle>
        <ItemIconStyle icon={'ant-design:windows-filled'} />
        <Typography variant="body2">{fShortenNumber(country.windows)}</Typography>
      </ItemBlockStyle>

      <ItemBlockStyle sx={{ minWidth: 88 }}>
        <ItemIconStyle icon={'ant-design:apple-filled'} />
        <Typography variant="body2">{fShortenNumber(country.windows)}</Typography>
      </ItemBlockStyle>
    </Stack>
  );
}
