import { Delete } from '@mui/icons-material';
import { Box, Card, IconButton } from '@mui/material';
import { FC, ReactNode } from 'react';

interface BlockWrapperProps {
  children: ReactNode;
  onDelete: () => void;
}

const BlockWrapper: FC<BlockWrapperProps> = ({ onDelete, children }) => {
  return (
    <Box marginBottom={1}>
      <Card>
        <Box m={2}>{children}</Box>
        <Box display="flex" justifyContent="end" m={2}>
          <IconButton onClick={() => onDelete()}>
            <Delete />
          </IconButton>
        </Box>
      </Card>
    </Box>
  );
};

export default BlockWrapper;
