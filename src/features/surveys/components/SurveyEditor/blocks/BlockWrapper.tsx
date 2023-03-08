import { Box, Card } from '@mui/material';
import { FC, ReactNode } from 'react';

interface BlockWrapperProps {
  children: ReactNode;
  hidden: boolean;
}

const BlockWrapper: FC<BlockWrapperProps> = ({ children, hidden }) => {
  return (
    <Box
      marginBottom={1}
      sx={{ opacity: hidden ? 0.5 : 1, transition: 'opacity 0.2s' }}
    >
      <Card>
        <Box m={2}>{children}</Box>
      </Card>
    </Box>
  );
};

export default BlockWrapper;
