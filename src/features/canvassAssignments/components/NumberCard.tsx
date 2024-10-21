import React, { FC } from 'react';
import { Card, CardContent, Typography, Box, lighten } from '@mui/material';

import theme from 'theme';
import ZUIStackedStatusBar from 'zui/ZUIStackedStatusBar';

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
        <ZUIStackedStatusBar
          values={[
            {
              color: theme.palette.primary.main,
              value: firstNumber,
            },
            {
              color: lighten(theme.palette.primary.main, 0.6),
              value: secondNumber - firstNumber,
            },
          ]}
        />

        <Box>
          <Typography mt={2}>{message}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NumberCard;
