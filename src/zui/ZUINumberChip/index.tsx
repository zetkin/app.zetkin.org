import { FC } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Theme } from '@mui/material';

type ZUINumberChipProps = {
  color: string;
  size?: keyof typeof FONT_SIZES;
  value: number | string;
  outlined?: boolean;
};

const FONT_SIZES = {
  lg: '1.8em',
  md: '1.2em',
  sm: '1em',
} as const;

const useStyles = makeStyles<
  Theme,
  { color: string; size: keyof typeof FONT_SIZES; outlined: boolean }
>((theme) => ({
  chip: {
    backgroundColor: ({ color, outlined }) =>
      outlined ? theme.palette.common.white : color,
    borderColor: ({ color }) => color,
    borderRadius: '1em',
    borderStyle: 'solid',
    borderWidth: 'thin',
    color: ({ color, outlined }) =>
      outlined ? color : theme.palette.getContrastText(color),
    display: 'flex',
    fontSize: ({ size }) => FONT_SIZES[size],
    lineHeight: 'normal',
    marginRight: '0.1em',
    overflow: 'hidden',
    padding: '0.2em 0.7em',
  },
}));

const ZUINumberChip: FC<ZUINumberChipProps> = ({
  color,
  size = 'md',
  value,
  outlined = false,
}) => {
  const classes = useStyles({ color, size, outlined });
  return <Box className={classes.chip}>{value}</Box>;
};

export default ZUINumberChip;
