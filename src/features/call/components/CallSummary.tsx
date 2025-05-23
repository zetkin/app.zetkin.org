import { FC } from 'react';
import { Box } from '@mui/material';

import ZUIText from 'zui/components/ZUIText';

const CallSummary: FC = () => {
  return (
    <Box gap={2} p={2}>
      <ZUIText variant="headingLg">Wohooo keep calling!!!</ZUIText>
    </Box>
  );
};

export default CallSummary;
