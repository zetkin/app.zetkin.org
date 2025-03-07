import { Box, Typography } from '@mui/material';
import React, { FC } from 'react';
import { useTheme } from '@mui/system';

export interface ZUIBarChartVerticalScaleProps {
  maxValue: number;
  minValue?: number;
  orientation?: 'horizontal' | 'vertical';
}
const ZUIBarChartVerticalScale: FC<ZUIBarChartVerticalScaleProps> = ({
  maxValue,
  minValue = 0,
  orientation = 'vertical',
}) => {
  const theme = useTheme();
  const style = {
    line: {
      backgroundColor: 'currentColor',
      height: '1px',
      width: theme.spacing(0.5),
    },
    lines: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    numbers: {
      '& span:first-of-type': {
        translate: '0 -50%',
      },
      '& span:last-of-type': {
        translate: '0 50%',
      },
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      textAlign: 'right',
    },
    root: {},
    scale: {
      color: 'text.secondary',
      display: 'flex',
      gap: 0.5,
      height: '100%',
      justifyContent: 'space-between',
      marginInlineStart: orientation === 'horizontal' ? '20%' : 0,
    },
  };

  return (
    <Box className="scaleContainer" sx={style.root}>
      <Box className="scale" sx={style.scale}>
        <Box className="numbers" sx={style.numbers}>
          <Typography className="number" variant="labelSmMedium">
            {maxValue}
          </Typography>
          <Typography className="number" variant="labelSmMedium">
            {minValue}
          </Typography>
        </Box>
        <Box className="lines" sx={style.lines}>
          <Box className="line" sx={style.line} />
          <Box className="line" sx={style.line} />
          <Box className="line" sx={style.line} />
        </Box>
      </Box>
    </Box>
  );
};

export default ZUIBarChartVerticalScale;
