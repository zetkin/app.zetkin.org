import { Box, Modal, Slide } from '@mui/material';
import { FC, ReactNode } from 'react';

import ModalBackground from '../ZUIModal/ModalBackground';

type Props = {
  children: ReactNode;
  onClose?: () => void;
  open: boolean;
};

const Drawer: FC<Props> = ({ children, onClose, open }) => {
  return (
    <Modal
      disableRestoreFocus
      hideBackdrop={true}
      onClose={onClose}
      open={open}
    >
      <>
        <Slide direction="up" in={open} timeout={300}>
          <Box
            sx={{
              backgroundColor: 'white',
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
              zIndex: 1,
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
        <Box
          onClick={onClose}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.5)',
            height: '100%',
            width: '100%',
            zIndex: 0,
          }}
        >
          <ModalBackground height="100%" width="100%" />
        </Box>
      </>
    </Modal>
  );
};

export default Drawer;
