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

import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import {
  hexColorToHouseholdColor,
  HouseholdColor,
  householdHexColors,
} from '../types';

type Props = {
  onChange: (newColor: HouseholdColor) => void;
  selectedColor: HouseholdColor | null;
};

const HouseholdColorPicker: FC<Props> = ({ selectedColor, onChange }) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);

  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel>
        <Msg id={messageIds.households.colorPicker.inputLabel} />
      </InputLabel>
      <Select
        label={messages.households.colorPicker.inputLabel()}
        MenuProps={{
          slotProps: {
            paper: {
              sx: {
                '& ul': {
                  display: 'grid',
                  gridGap: '4px',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))',
                  listStyle: 'none',
                  padding: 1,
                },
              },
            },
          },
          sx: { zIndex: 100000 },
        }}
        onChange={(ev) => onChange(ev.target.value as HouseholdColor)}
        renderValue={(value: HouseholdColor) => {
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
                  ? messages.households.colorPicker.noColor()
                  : messages.households.colorPicker.colorNames[
                      hexColorToHouseholdColor[value]
                    ]()}
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
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'center',
            span: {
              padding: '0 0 100%',
            },
          }}
          value="clear"
        >
          <Close color="secondary" />
        </MenuItem>
        {householdHexColors.map((color, index) => {
          return (
            <MenuItem
              key={index}
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
                '&:focus-visible': { backgroundColor: darken(color, 0.25) },
                '&:hover': { backgroundColor: darken(color, 0.5) },
                alignItems: 'center',
                backgroundColor: color,
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'center',
                span: {
                  padding: '0 0 100%',
                },
              }}
              value={color}
            >
              <Box
                sx={{
                  backgroundColor: color,
                  borderRadius: '4px',
                  minHeight: '30px',
                  minWidth: '30px',
                }}
              />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default HouseholdColorPicker;
