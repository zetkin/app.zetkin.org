'use client';

import { Box, Typography } from '@mui/material';
import { FC } from 'react';

type Props = {
  amount: number;
  label: string;
};

const AssignmentStatsCard: FC<Props> = ({ amount, label }) => {
  return (
    <Box sx={{ minWidth: 200, p: 2 }}>
      <Typography variant="h2">{amount}</Typography>
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
};

export default AssignmentStatsCard;
