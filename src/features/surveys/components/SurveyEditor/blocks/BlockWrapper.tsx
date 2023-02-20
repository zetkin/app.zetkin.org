import { Box, Card, IconButton } from '@mui/material';
import { Delete, RemoveRedEye } from '@mui/icons-material';
import { FC, ReactNode } from 'react';

interface BlockWrapperProps {
  children: ReactNode;
  hidden: boolean;
  onDelete: () => void;
  onToggleHidden: (hidden: boolean) => void;
}

const BlockWrapper: FC<BlockWrapperProps> = ({
  children,
  hidden,
  onDelete,
  onToggleHidden,
}) => {
  return (
    <Box
      marginBottom={1}
      sx={{ opacity: hidden ? 0.5 : 1, transition: 'opacity 0.2s' }}
    >
      <Card>
        <Box m={2}>{children}</Box>
        <Box display="flex" justifyContent="end" m={2}>
          <IconButton onClick={() => onToggleHidden(!hidden)}>
            <RemoveRedEye />
          </IconButton>
          <IconButton
            onClick={(evt) => {
              evt.stopPropagation();
              onDelete();
            }}
          >
            <Delete />
          </IconButton>
        </Box>
      </Card>
    </Box>
  );
};

export default BlockWrapper;
