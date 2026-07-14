import { FC } from 'react';
import { Box } from '@mui/material';

import oldTheme from 'theme';

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

const ZUINumberChip: FC<ZUINumberChipProps> = ({
  color,
  size = 'md',
  value,
  outlined = false,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: outlined ? oldTheme.palette.common.white : color,
        borderColor: color,
        borderRadius: '1em',
        borderStyle: 'solid',
        borderWidth: 'thin',
        color: outlined ? color : oldTheme.palette.getContrastText(color),
        display: 'flex',
        flexShrink: 0,
        fontSize: FONT_SIZES[size],
        lineHeight: 'normal',
        marginRight: '0.1em',
        overflow: 'hidden',
        padding: '0.2em 0.7em',
      }}
    >
      {value}
    </Box>
  );
};

export default ZUINumberChip;
