import dynamic from 'next/dynamic';
import { FC } from 'react';
import { Box, Dialog } from '@mui/material';

import 'leaflet/dist/leaflet.css';

interface LocationModalProps {
  open: boolean;
}

const LocationModal: FC<LocationModalProps> = ({ open }) => {
  const Map = dynamic(() => import('./Map'), { ssr: false });
  return (
    <Dialog fullWidth maxWidth="lg" open={open}>
      <Box height={'calc(100vh - 20px)'} padding={2}>
        <Map />
      </Box>
    </Dialog>
  );
};

export default LocationModal;
