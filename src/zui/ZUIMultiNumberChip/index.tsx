import { FC } from 'react';
import { Box } from '@mui/material';

import oldTheme from 'theme';

const FONT_SIZES = {
  lg: '1.2em',
  md: '1em',
  sm: '0.9em',
} as const;

interface ZUIMultiNumberChipProps {
  blueValue: number | string | undefined;
  greenValue: number | string | undefined;
  orangeValue: number | string | undefined;
  size?: keyof typeof FONT_SIZES;
}

const ZUIMultiNumberChip: FC<ZUIMultiNumberChipProps> = ({
  blueValue,
  greenValue,
  orangeValue,
  size = 'sm',
}) => {
  const blue = {
    borderColor: oldTheme.palette.statusColors.blue,
    borderStyle: 'solid none solid solid',
    color: oldTheme.palette.statusColors.blue,
    padding: '3px 5px',
  };
  const chip = {
    borderWidth: '2px',
    fontSize: FONT_SIZES[size],
  };
  const green = {
    borderColor: oldTheme.palette.statusColors.green,
    borderRadius: '0 50em 50em 0',
    borderStyle: 'solid',
    color: oldTheme.palette.statusColors.green,
    padding: '3px 7px 3px 5px',
  };
  const orange = {
    borderColor: oldTheme.palette.statusColors.orange,
    borderRadius: '50em 0 0 50em',
    borderStyle: 'solid none solid solid',
    color: oldTheme.palette.statusColors.orange,
    padding: '3px 5px 3px 7px',
  };

  return (
    <Box display="flex">
      <Box sx={[orange, chip]}>{orangeValue || 0}</Box>
      {typeof blueValue !== 'undefined' && (
        <Box sx={[blue, chip]}>{blueValue}</Box>
      )}
      <Box sx={[green, chip]}>{greenValue || 0}</Box>
    </Box>
  );
};

export default ZUIMultiNumberChip;
