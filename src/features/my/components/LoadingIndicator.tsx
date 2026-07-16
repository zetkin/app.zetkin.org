import { Box } from '@mui/material';
import { FC } from 'react';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';

const LoadingIndicator: FC = () => {
  return (
    <Box
      alignItems="center"
      display="flex"
      flexDirection="column"
      height="90dvh"
      justifyContent="center"
    >
      <ZUILogoLoadingIndicator />
    </Box>
  );
};

export default LoadingIndicator;
