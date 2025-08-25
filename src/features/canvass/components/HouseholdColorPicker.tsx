import { FC } from 'react';
import { Close } from '@mui/icons-material';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

import { getContrastColor } from 'utils/colorUtils';

type Props = {
  color: string | null;
  onChange: (newColor: string | null) => void;
};

const HouseholdColorPicker: FC<Props> = ({ color, onChange }) => {
  //TODO: use from theme object, when canvass is moved to ZUI
  const colors = [
    '#F1A8A8',
    '#F7BC9E',
    '#FDDF91',
    '#DFEF95',
    '#BBF1AD',
    '#99E9CC',
    '#93E9EB',
    '#B3DAEE',
    '#CAC7F7',
    '#E5C0F5',
    '#F1A9C9',
    '#DC2626',
    '#EA580C',
    '#FBBF24',
    '#C0DE2B',
    '#77E25B',
    '#34D399',
    '#28D4D7',
    '#0284C7',
    '#4F46E5',
    '#AA2DDF',
    '#DB2777',
    '#841717',
    '#8C3507',
    '#977316',
    '#73851A',
    '#478837',
    '#1F7F5C',
    '#187F81',
    '#014F77',
    '#2F2A89',
    '#661B86',
    '#831747',
    '#6D6D6D',
    '#000000',
  ];

  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel>Household color</InputLabel>
      <Select
        label="Household color"
        MenuProps={{
          slotProps: {
            paper: {
              sx: {
                '& ul': {
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.5,
                  padding: 1,
                },
              },
            },
          },
          sx: { zIndex: 600000000 },
        }}
        onChange={(ev) => onChange(ev.target.value)}
        renderValue={() => (
          <Typography color={color ? getContrastColor(color) : 'primary'}>
            {color}
          </Typography>
        )}
        sx={{ backgroundColor: color }}
        value={color}
      >
        <MenuItem key="clear" sx={{ flex: 1, minWidth: 48 }} value="clear">
          <Close />
        </MenuItem>
        {colors.map((color) => (
          <MenuItem
            key={color}
            sx={{
              '&:hover': { backgroundColor: color },
              backgroundColor: color,
              flex: 1,
              minWidth: 48,
            }}
            value={color}
          />
        ))}
      </Select>
    </FormControl>
  );
};

export default HouseholdColorPicker;
