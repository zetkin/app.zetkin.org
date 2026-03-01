import { Box, Fade, Modal, Paper } from '@mui/material';
import { FC } from 'react';

import { ZUISize } from '../types';
import ModalBackground from './ModalBackground';
import { ZUIModalProps } from '.';
import ModalContent from './ModalContent';
import { toHash } from 'utils/randomUtils';

const widths: Record<ZUISize | 'auto' | 'full', string> = {
  auto: 'auto',
  full: 'calc(100dvw - 2.5rem)',
  large: '60rem',
  medium: '37.5rem',
  small: '25rem',
};

const DesktopModal: FC<ZUIModalProps> = ({
  children,
  onClose,
  open,
  primaryButton,
  secondaryButton,
  size = 'auto',
  title,
}) => {
  return (
    <Modal
      disableRestoreFocus
      hideBackdrop={true}
      onClose={onClose}
      open={open}
    >
      <>
        <Fade in={open} timeout={300}>
          <Paper
            sx={(theme) => ({
              border: `0.063rem solid ${theme.palette.dividers.main}`,
              boxShadow: theme.elevation.bottom.big.medium,
              height: size == 'full' ? 'calc(100dvh - 3.75rem)' : 'auto',
              left: '50%',
              maxWidth: 'calc(100dvw - 2.5rem)',
              minWidth: '25rem',
              position: 'absolute',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: widths[size],
              zIndex: 10,
            })}
          >
            <ModalContent
              isMobile={false}
              onClose={onClose}
              primaryButton={primaryButton}
              secondaryButton={secondaryButton}
              title={title}
            >
              {children}
            </ModalContent>
          </Paper>
        </Fade>
        <Box
          onClick={onClose}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.5)',
            height: '100%',
            width: '100%',
            zIndex: 0,
          }}
        >
          <ModalBackground height="100%" seed={toHash(title)} width="100%" />
        </Box>
      </>
    </Modal>
  );
};

export default DesktopModal;
