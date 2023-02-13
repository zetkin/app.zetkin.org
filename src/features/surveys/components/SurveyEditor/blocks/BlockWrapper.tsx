import { Box, Card } from '@mui/material';
import { FC, ReactNode } from 'react';

interface BlockWrapperProps {
  children: ReactNode;
}

const BlockWrapper: FC<BlockWrapperProps> = ({ children }) => {
  return (
    <Box marginBottom={1}>
      <Card>
        <Box m={2}>{children}</Box>
      </Card>
    </Box>
  );
};

export default BlockWrapper;
