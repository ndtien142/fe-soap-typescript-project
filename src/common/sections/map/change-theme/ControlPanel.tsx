import { memo } from 'react';
// @mui
import { Radio, Typography, RadioGroup, FormControlLabel } from '@mui/material';
// components
import { ControlPanelStyle } from '../../../components/map';

// ----------------------------------------------------------------------

type Props = {
  themes: {
    [key: string]: string;
  };
  selectTheme: string;
  onChangeTheme: (theme: string) => void;
};

function ControlPanel({ themes, selectTheme, onChangeTheme }: Props) {
  return (
    <ControlPanelStyle>
      <Typography gutterBottom variant="subtitle2" sx={{ color: 'common.white' }}>
        Select Theme:
      </Typography>

      <RadioGroup value={selectTheme} onChange={(e, value) => onChangeTheme(value)}>
        {Object.keys(themes).map((item) => (
          <FormControlLabel
            key={item}
            value={item}
            control={<Radio size="small" />}
            label={item}
            sx={{ color: 'common.white', textTransform: 'capitalize' }}
          />
        ))}
      </RadioGroup>
    </ControlPanelStyle>
  );
}

export default memo(ControlPanel);
