import { KeyboardArrowDown } from '@mui/icons-material';
import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';

import ZUIModalBackground from 'zui/ZUIModalBackground';

type Props = {
  children: ReactNode;
  onClose: () => void;
};

const DrawerModal: FC<Props> = ({ children, onClose }) => {
  return (
    <Box
      bottom={0}
      height="100%"
      left={0}
      onClick={() => onClose()}
      position="fixed"
      width="100%"
      zIndex={9999}
    >
      <ZUIModalBackground height="100%" width="100%" />
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
            width: '32px',
          })}
        >
          <KeyboardArrowDown color="secondary" />
        </Box>
        <Box>{children}</Box>
      </Box>
    </Box>
  );
};

export default DrawerModal;
