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
        flexGrow: 1,
        marginRight: 1,
        padding: '16px',
        textAlign: 'center',
      }}
    >
      <CardContent>
        <Box alignItems="baseline" display="flex" justifyContent="center">
          <Typography
            sx={{
              color: theme.palette.primary.main,

              marginRight: '4px',
            }}
            variant="h2"
          >
            {firstNumber}
          </Typography>
          <Typography color={theme.palette.secondary.light} variant="h5">
            /{secondNumber}
          </Typography>
        </Box>
        <Box>
          <Typography>{message}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NumberCard;
