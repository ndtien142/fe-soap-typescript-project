import { memo } from 'react';
// @mui
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
// components
import { ControlPanelStyle } from '../../../components/map';

// ----------------------------------------------------------------------

export type CityProps = {
  city: string;
  population: string;
  image: string;
  state: string;
  latitude: number;
  longitude: number;
};

type Props = {
  data: CityProps[];
  selectedCity: string;
  onSelectCity: (event: React.ChangeEvent<HTMLInputElement>, city: CityProps) => void;
};

function ControlPanel({ data, selectedCity, onSelectCity }: Props) {
  return (
    <ControlPanelStyle>
      {data.map((city) => (
        <RadioGroup
          key={city.city}
          value={selectedCity}
          onChange={(event) => onSelectCity(event, city)}
        >
          <FormControlLabel
            value={city.city}
            label={city.city}
            control={<Radio size="small" />}
            sx={{ color: 'common.white' }}
          />
        </RadioGroup>
      ))}
    </ControlPanelStyle>
  );
}

export default memo(ControlPanel);
