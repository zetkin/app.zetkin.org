import React, { FC } from 'react';
import { Typography, Box } from '@mui/material';

import theme from 'theme';

type NumberCardProps = {
  firstNumber: number;
  message: string;
  secondNumber: number;
};

const NumberCard: FC<NumberCardProps> = ({
  firstNumber,
  message,
  secondNumber,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        margin: 1,
        textAlign: 'left',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', marginRight: 2 }}>
        <Box alignItems="baseline" display="flex" justifyContent="left">
          <Typography
            sx={{
              color: theme.palette.primary.main,

              marginRight: '2px',
            }}
            variant="h3"
          >
            {firstNumber}
          </Typography>
          <Typography color={theme.palette.secondary.light} variant="h5">
            /{secondNumber}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 14 }}>{message}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default NumberCard;
