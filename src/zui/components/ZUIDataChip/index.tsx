import { Box, Typography, useTheme } from '@mui/material';
import { FC } from 'react';

type ZUIDataChipProps = {
  /**
   * Sets the color of the chip. Defaults to 'none'.
   */
  status: 'none' | 'dark' | 'medium' | 'light';

  /**
   * The number value to be displayed in the chip.
   */
  value: number;
};

const ZUIDataChip: FC<ZUIDataChipProps> = ({ status, value }) => {
  const theme = useTheme();

  const getChipColor = () => {
    if (status == 'none') {
      return theme.palette.grey[100];
    } else if (status == 'dark') {
      return theme.palette.data.main;
    } else if (status == 'medium') {
      return theme.palette.data.mid2;
    } else {
      //status is 'light'
      return theme.palette.data.final;
    }
  };

  return (
    <Box
      bgcolor={getChipColor()}
      display="inline-flex"
      sx={{
        borderRadius: '2rem',
        overflow: 'hidden',
        padding: '0.25rem 0.75rem',
      }}
    >
      <Typography
        sx={{
          color:
            status == 'none' || status == 'light'
              ? theme.palette.common.black
              : theme.palette.common.white,
        }}
        variant="headingMd"
      >
        {value}
      </Typography>
    </Box>
  );
};

export default ZUIDataChip;
