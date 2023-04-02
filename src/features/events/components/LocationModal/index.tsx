import dynamic from 'next/dynamic';
import { FC } from 'react';
import { InfoOutlined } from '@mui/icons-material';
import { Box, Dialog, Typography } from '@mui/material';

import 'leaflet/dist/leaflet.css';
import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';

interface LocationModalProps {
  open: boolean;
}

const LocationModal: FC<LocationModalProps> = ({ open }) => {
  const Map = dynamic(() => import('./Map'), { ssr: false });
  const messages = useMessages(messageIds);
  return (
    <Dialog fullWidth maxWidth="lg" open={open}>
      <Box padding={2}>
        <Box height="80vh">
          <Map />
        </Box>
        <Box alignItems="center" display="flex" paddingTop={1}>
          <InfoOutlined color="secondary" />
          <Typography color="secondary" paddingLeft={1}>
            {messages.locationModal.infoText()}
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};

export default LocationModal;
