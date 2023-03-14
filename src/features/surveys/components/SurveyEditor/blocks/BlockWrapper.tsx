import { Box, Card } from '@mui/material';
import { FC, ReactNode } from 'react';

interface BlockWrapperProps {
  children: ReactNode;
  dragging: boolean;
  hidden: boolean;
}

const BlockWrapper: FC<BlockWrapperProps> = ({
  children,
  dragging,
  hidden,
}) => {
  return (
    <Box
      marginBottom={1}
      sx={{
        boxShadow: dragging ? '0 0 20px rgba(0,0,0,0.1)' : 'none',
        flex: '1 0',
        opacity: hidden ? 0.5 : 1,
        transform: dragging ? 'scale(101%) translate(0.3%, 0)' : 'none',
        transition: 'opacity 0.2s, box-shadow 0.1s, transform 0.1s',
      }}
    >
      <Card>
        <Box m={2}>{children}</Box>
      </Card>
    </Box>
  );
};

export default BlockWrapper;
