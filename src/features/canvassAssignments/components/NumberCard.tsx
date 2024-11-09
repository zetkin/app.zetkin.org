import React, { FC } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

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
    <Card
      sx={{
        flex: 1,
        textAlign: 'center',
      }}
    >
      <CardContent>
        <Box alignItems="baseline" display="flex" justifyContent="center">
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
        <Typography sx={{ fontSize: 14 }}>{message}</Typography>
      </CardContent>
    </Card>
  );
};

export default NumberCard;
