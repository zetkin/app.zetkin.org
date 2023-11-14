import { PropsWithChildren } from 'react';
import { Box, useTheme } from '@mui/system';
import { Button, Drawer, useMediaQuery } from '@mui/material';

const LocationDrawer = ({
  onClose,
  children,
}: PropsWithChildren<{ onClose: () => void }>) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <Drawer
      anchor={isDesktop ? 'right' : 'bottom'}
      onClose={onClose}
      open={Boolean(children)}
    >
      <Button onClick={onClose}>Close</Button>
      <Box onClick={onClose} padding={2} role="presentation">
        {children}
      </Box>
    </Drawer>
  );
};

export default LocationDrawer;
