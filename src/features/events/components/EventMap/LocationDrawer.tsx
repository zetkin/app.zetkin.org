import { Box } from '@mui/system';
import { PropsWithChildren } from 'react';
import { Button, Drawer } from '@mui/material';

const LocationDrawer = ({
  onClose,
  children,
}: PropsWithChildren<{ onClose: () => void }>) => {
  return (
    <Drawer anchor={'bottom'} onClose={onClose} open={Boolean(children)}>
      <Button onClick={onClose}>Close</Button>
      <Box onClick={onClose} padding={2} role="presentation">
        {children}
      </Box>
    </Drawer>
  );
};

export default LocationDrawer;
