import { FC } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Theme } from '@mui/material';

type ZUINumberChipProps = {
  color: string;
  outlined?: boolean;
  size?: keyof typeof FONT_SIZES;
  value: number | string;
};

const FONT_SIZES = {
  lg: '1.8em',
  md: '1.2em',
  sm: '1em',
} as const;

const useStyles = makeStyles<
  Theme,
  { color: string; outlined: boolean; size: keyof typeof FONT_SIZES }
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
    flexShrink: 0,
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
  const classes = useStyles({ color, outlined, size });
  return <Box className={classes.chip}>{value}</Box>;
};

export default ZUINumberChip;
