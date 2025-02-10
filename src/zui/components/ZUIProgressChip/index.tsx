import { Box, Typography, useTheme } from '@mui/material';
import { FC } from 'react';

import { ZUIMedium, ZUISmall } from '../types';

type ZUIProgressChipProps = {
  /**
   * The size of the component. Defaults to 'small'.
   */
  size?: ZUISmall | ZUIMedium;

  /**
   * Values to be displayed in each of the sections of the chip.
   * An array of 2, 3 or 4 numbers.
   */
  values:
    | [number, number]
    | [number, number, number]
    | [number, number, number, number];
};

const ZUIProgressChip: FC<ZUIProgressChipProps> = ({
  size = 'small',
  values,
}) => {
  const theme = useTheme();

  const colors = [theme.palette.data.main, theme.palette.data.final];

  //Add middle colors to the colors array
  if (values.length == 3) {
    colors.splice(1, 0, theme.palette.data.mid2);
  } else if (values.length == 4) {
    colors.splice(1, 0, theme.palette.data.mid3, theme.palette.data.mid1);
  }

  return (
    <Box display="inline-flex" sx={{ borderRadius: '2em', overflow: 'hidden' }}>
      {values.map((value, index) => (
        <Box
          key={`${value}-${index}`}
          bgcolor={colors[index]}
          color={
            index == values.length - 1
              ? theme.palette.common.black
              : theme.palette.common.white
          }
          sx={{
            borderLeft:
              index > 0 ? `0.063rem solid ${theme.palette.common.white}` : '',
            paddingLeft: index == 0 ? '0.625rem' : '0.375rem',
            paddingRight: index == values.length - 1 ? '0.625rem' : '0.375rem',
            paddingY: size == 'small' ? '0.188rem' : '0.438rem',
          }}
        >
          <Typography variant="labelSmMedium">{value}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ZUIProgressChip;
