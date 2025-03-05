import { Box, Typography } from '@mui/material';
import { FC } from 'react';

type ZUIDataChipProps = {
  /**
   * Sets the color of the chip. Defaults to 'grey'.
   *
   * Note!
   * There are 5 purple colors available. They should be used in combos of
   * 2, 3 or 4 shades, like this:
   *
   * - When using 2 purple chips the correct color order is: main, final
   * - When using 3 purple chips the correct color order is: main, mid2, final
   * - When using 4 purple chips the correct color order is: main, mid3, mid1, final
   */
  color?: 'grey' | 'main' | 'mid1' | 'mid2' | 'mid3' | 'final';

  /**
   * The number value to be displayed in the chip.
   */
  value: number;
};

const ZUIDataChip: FC<ZUIDataChipProps> = ({ color = 'grey', value }) => (
  <Box
    sx={(theme) => ({
      backgroundColor:
        color == 'grey' ? theme.palette.grey[100] : theme.palette.data[color],
      borderRadius: '2rem',
      display: 'inline-flex',
      overflow: 'hidden',
      padding: '0.25rem 0.75rem',
    })}
  >
    <Typography
      sx={(theme) => ({
        color:
          color == 'grey' || color == 'final'
            ? theme.palette.common.black
            : theme.palette.common.white,
      })}
      variant="headingMd"
    >
      {value}
    </Typography>
  </Box>
);

export default ZUIDataChip;
