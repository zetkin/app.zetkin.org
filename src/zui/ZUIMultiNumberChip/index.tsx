import { FC } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Theme } from '@mui/material';

import oldTheme from 'theme';

const FONT_SIZES = {
  lg: '1.2em',
  md: '1em',
  sm: '0.9em',
} as const;

const useStyles = makeStyles<Theme, { size: keyof typeof FONT_SIZES }>(() => ({
  blue: {
    borderColor: oldTheme.palette.statusColors.blue,
    borderStyle: 'solid none solid solid',
    color: oldTheme.palette.statusColors.blue,
    padding: '3px 5px',
  },
  chip: {
    borderWidth: '2px',
    fontSize: ({ size }) => FONT_SIZES[size],
  },
  green: {
    borderColor: oldTheme.palette.statusColors.green,
    borderRadius: '0 50em 50em 0',
    borderStyle: 'solid',
    color: oldTheme.palette.statusColors.green,
    padding: '3px 7px 3px 5px',
  },
  orange: {
    borderColor: oldTheme.palette.statusColors.orange,
    borderRadius: '50em 0 0 50em',
    borderStyle: 'solid none solid solid',
    color: oldTheme.palette.statusColors.orange,
    padding: '3px 5px 3px 7px',
  },
}));

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
  const classes = useStyles({ size });

  return (
    <Box display="flex">
      <Box className={`${classes.orange} ${classes.chip}`}>
        {orangeValue || 0}
      </Box>
      {typeof blueValue !== 'undefined' && (
        <Box className={`${classes.blue} ${classes.chip}`}>{blueValue}</Box>
      )}
      <Box className={`${classes.green} ${classes.chip}`}>
        {greenValue || 0}
      </Box>
    </Box>
  );
};

export default ZUIMultiNumberChip;
