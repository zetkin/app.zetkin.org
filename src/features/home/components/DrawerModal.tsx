import { KeyboardArrowDown } from '@mui/icons-material';
import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';

import ZUIModalBackground from 'zui/ZUIModalBackground';

type Props = {
  children: ReactNode;
  onClose: () => void;
  open?: boolean;
};

const DrawerModal: FC<Props> = ({ children, onClose, open }) => {
  return (
    <Box
      bottom={0}
      height="100%"
      left={0}
      position="fixed"
      sx={{
        pointerEvents: open ? 'auto' : 'none',
      }}
      width="100%"
      zIndex={9999}
    >
      <Box
        onClick={() => onClose()}
        sx={{
          height: '100%',
          opacity: open ? 1 : 0,
          transitionDelay: '0.2s',
          transitionDuration: open ? '1s' : '0.5s',
          transitionProperty: 'opacity',
          width: '100%',
        }}
      >
        <ZUIModalBackground height="100%" width="100%" />
      </Box>
      <Box
        sx={{
          WebkitOverflowScrolling: 'touch',
          bgcolor: 'white',
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          height: 'auto',
          left: 0,
          maxHeight: '100%',
          outline: 0,
          position: 'fixed',
          right: 0,
          top: 'auto',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s',
          width: '100%',
          zIndex: 10000,
        }}
      >
        <Box
          onClick={() => onClose()}
          sx={(theme) => ({
            alignItems: 'center',
            bgcolor: theme.palette.common.white,
            borderRadius: '100%',
            cursor: 'pointer',
            display: 'flex',
            height: '32px',
            justifyContent: 'center',
            left: '50%',
            position: 'absolute',
            top: -40,
            transform: 'translateX(-50%)',
            visibility: open ? 'visible' : 'hidden',
            width: '32px',
          })}
        >
          <KeyboardArrowDown color="secondary" />
        </Box>
        <Box sx={{ maxHeight: 'calc(100dvh - 60px)', overflowY: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DrawerModal;
