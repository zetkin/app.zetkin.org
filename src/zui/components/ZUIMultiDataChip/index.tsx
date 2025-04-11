import { Box, Typography, useTheme } from '@mui/material';
import { FC } from 'react';

import { ZUIMedium, ZUISmall } from '../types';

export type ZUIMultiDataChipProps = {
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

const ZUIMultiDataChip: FC<ZUIMultiDataChipProps> = ({
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
    <Box sx={{ display: 'flex', height: 'fit-content' }}>
      {values.map((value, index) => {
        const isFirst = index == 0;
        const isLast = index == values.length - 1;

        const getBorderRadius = () => {
          if (isFirst) {
            return '2em 0 0 2em';
          }

          if (isLast) {
            return '0 2em 2em 0';
          }
        };

        return (
          <Box
            key={`${value}-${index}`}
            sx={(theme) => ({
              backgroundColor: colors[index],
              borderLeft:
                index > 0 ? `0.063rem solid ${theme.palette.common.white}` : '',
              borderRadius: getBorderRadius(),
              color:
                index == values.length - 1
                  ? theme.palette.common.black
                  : theme.palette.common.white,
              paddingLeft: index == 0 ? '0.625rem' : '0.375rem',
              paddingRight:
                index == values.length - 1 ? '0.625rem' : '0.375rem',
              paddingY: size == 'small' ? '0.188rem' : '0.438rem',
            })}
          >
            <Typography variant="labelSmMedium">{value}</Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default ZUIMultiDataChip;
