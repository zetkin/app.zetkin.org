import { Close } from '@mui/icons-material';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { FC } from 'react';

type Props = {
  color: string | null;
  onChange: (newColor: string | null) => void;
};

const HouseholdColorPicker: FC<Props> = ({ color, onChange }) => {
  const colors = [
    '#f1a8a8',
    '#dc2626',
    '#0284c7',
    '#93e9eb',
    '#77e25b',
    '#ea580c',
    '#831747',
    '#73851a',
    '#cac7f7',
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
                '& ul': { display: 'flex', flexWrap: 'wrap', paddingY: 0 },
              },
            },
          },
          sx: { zIndex: 600000000 },
        }}
        onChange={(ev) => onChange(ev.target.value)}
        renderValue={() => color}
        sx={{ backgroundColor: color }}
        value={color}
      >
        <MenuItem key="clear" sx={{ flex: 1 }} value="clear">
          <Close />
        </MenuItem>
        {colors.map((color) => (
          <MenuItem
            key={color}
            sx={{
              '&:hover': { backgroundColor: color },
              backgroundColor: color,
              flex: 1,
              minWidth: 55,
            }}
            value={color}
          />
        ))}
      </Select>
    </FormControl>
  );
};

export default HouseholdColorPicker;
