import { FC } from 'react';
import { Close } from '@mui/icons-material';
import {
  Box,
  darken,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material';

type Props = {
  onChange: (newColor: string) => void;
  selectedColor: string | null;
};

const HouseholdColorPicker: FC<Props> = ({ selectedColor, onChange }) => {
  const theme = useTheme();
  //TODO: use from theme object, when canvass is moved to ZUI
  const colors = [
    { label: 'Light red', value: '#F1A8A8' },
    { label: 'Light orange', value: '#F7BC9E' },
    { label: 'Light yellow', value: '#FDDF91' },
    { label: 'Light lime', value: '#DFEF95' },
    { label: 'Light green', value: '#BBF1AD' },
    { label: 'Light turquoise', value: '#99E9CC' },
    { label: 'Light aqua', value: '#93E9EB' },
    { label: 'Light blue', value: '#B3DAEE' },
    { label: 'Light indigo', value: '#CAC7F7' },
    { label: 'Light purple', value: '#E5C0F5' },
    { label: 'Light pink', value: '#F1A9C9' },
    { label: 'Medium red', value: '#DC2626' },
    { label: 'Medium orange', value: '#EA580C' },
    { label: 'Medium yellow', value: '#FBBF24' },
    { label: 'Medium lime', value: '#C0DE2B' },
    { label: 'Medium green', value: '#77E25B' },
    { label: 'Medium turquoise', value: '#34D399' },
    { label: 'Medium aqua', value: '#28D4D7' },
    { label: 'Medium blue', value: '#0284C7' },
    { label: 'Medium indigo', value: '#4F46E5' },
    { label: 'Medium purple', value: '#AA2DDF' },
    { label: 'Medium pink', value: '#DB2777' },
    { label: 'Dark red', value: '#841717' },
    { label: 'Dark orange', value: '#8C3507' },
    { label: 'Dark yellow', value: '#977316' },
    { label: 'Dark lime', value: '#73851A' },
    { label: 'Dark green', value: '#478837' },
    { label: 'Dark turquiose', value: '#1F7F5C' },
    { label: 'Dark aqua', value: '#187F81' },
    { label: 'Dark blue', value: '#014F77' },
    { label: 'Dark indigo', value: '#2F2A89' },
    { label: 'Dark purple', value: '#661B86' },
    { label: 'Dark pink', value: '#831747' },
    { label: 'Grey', value: '#6D6D6D' },
    { label: 'Black', value: '#000000' },
  ];

  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel>Edit household color</InputLabel>
      <Select
        label="Edit household color"
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
          sx: { zIndex: 100000 },
        }}
        onChange={(ev) => onChange(ev.target.value)}
        renderValue={(value) => {
          return (
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
              {value != 'clear' && (
                <Box
                  sx={{
                    backgroundColor: value,
                    borderRadius: '4px',
                    height: '30px',
                    width: '30px',
                  }}
                />
              )}
              <Typography>
                {value == 'clear'
                  ? 'No color'
                  : colors.find((color) => color.value == selectedColor)?.label}
              </Typography>
            </Box>
          );
        }}
        value={selectedColor ?? ''}
      >
        <MenuItem
          key="clear"
          sx={{
            '&.Mui-selected': {
              backgroundColor: theme.palette.common.white,
              border: `2px solid ${theme.palette.common.black}`,
              borderRadius: '4px',
            },
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
          }}
          value="clear"
        >
          <Close color="secondary" />
        </MenuItem>
        {colors.map((color) => (
          <MenuItem
            key={color.value}
            sx={{
              '&.Mui-selected': {
                '&:focus-visible': {
                  backgroundColor: darken(theme.palette.common.white, 0.25),
                },
                '&:hover': {
                  backgroundColor: darken(theme.palette.common.white, 0.5),
                },
                backgroundColor: theme.palette.common.white,
                border: `2px solid ${theme.palette.common.black}`,
              },
              '&:focus-visible': { backgroundColor: darken(color.value, 0.25) },
              '&:hover': { backgroundColor: darken(color.value, 0.5) },
              alignItems: 'center',
              backgroundColor: color.value,
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'center',
            }}
            value={color.value}
          >
            <Box
              sx={{
                backgroundColor: color.value,
                borderRadius: '4px',
                height: '30px',
                width: '30px',
              }}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default HouseholdColorPicker;
