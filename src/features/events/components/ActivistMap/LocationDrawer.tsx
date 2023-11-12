import { Box } from '@mui/system';
import { Drawer } from '@mui/material';
import { FC } from 'react';

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

  const list = () => (
    <Box
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      role="presentation"
    >
      {children}
    </Box>
  );

  return (
    <Drawer anchor={'bottom'} onClose={toggleDrawer(false)} open={open}>
      {list()}
    </Drawer>
  );
};

export default LocationDrawer;
