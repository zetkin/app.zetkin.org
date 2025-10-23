import { Box, Fade, Modal, Slide, useTheme } from '@mui/material';
import { FC, ReactNode } from 'react';

import ModalBackground from '../ZUIModal/ModalBackground';

type Props = {
  children: ReactNode;
  onClose?: () => void;
  open: boolean;
};

const Drawer: FC<Props> = ({ children, onClose, open }) => {
  const theme = useTheme();

  return (
    <Modal
      disableRestoreFocus
      onClose={onClose}
      open={open}
      slots={{
        backdrop: () => (
          <Fade in={open} timeout={300}>
            <Box
              onClick={onClose}
              sx={{
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(0, 0, 0, 0.5)'
                    : 'rgba(255,255,255,0.5)',
                height: '100%',
                width: '100%',
              }}
            >
              <ModalBackground height="100%" width="100%" />
            </Box>
          </Fade>
        ),
      }}
    >
      <Slide direction="up" in={open} timeout={300}>
        <Box
          sx={{
            backgroundColor:
              theme.palette.mode === 'dark' ? theme.palette.grey[900] : 'white',
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            height: 'auto',
            left: 0,
            maxHeight: '100%',
            outline: 0,
            pointerEvents: open ? 'auto' : 'none',
            position: 'fixed',
            right: 0,
            top: 'auto',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              maxHeight: 'calc(100dvh - 3.75rem)',
              overflow: 'hidden',
            }}
          >
            {children}
          </Box>
        </Box>
      </Slide>
    </Modal>
  );
};

export default Drawer;
