import { Close } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { FC, ReactNode } from 'react';

interface PaneProps {
  children: ReactNode;
  onClose: () => void;
}

const Pane: FC<PaneProps> = ({ children, onClose }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        maxHeight: '100%',
        padding: 1,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
        }}
      >
        <IconButton onClick={() => onClose()}>
          <Close />
        </IconButton>
      </Box>
      <Box
        sx={{
          flex: 1,
          overflowY: 'scroll',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Pane;
