import { Box } from '@mui/system';
import { FC } from 'react';
import { Button, Drawer } from '@mui/material';

interface LocationDrawerProps {
  open: boolean;
  onToggleOpen: (open: boolean) => void;
  children: React.ReactNode;
}

const LocationDrawer: FC<LocationDrawerProps> = ({
  open,
  onToggleOpen,
  children,
}) => {
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      onToggleOpen(open);
    };

  return (
    <Drawer anchor={'bottom'} onClose={toggleDrawer(false)} open={open}>
      <Button onClick={toggleDrawer(false)}>Close</Button>
      <Box
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
        padding={2}
        role="presentation"
      >
        {children}
      </Box>
    </Drawer>
  );
};

export default LocationDrawer;
