import { Close } from '@mui/icons-material';
import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';

import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinLocation } from 'utils/types/zetkin';

interface LocationDetailsCardProps {
  onClose: () => void;
  onSelectLocation: () => void;
  selectedLocation: ZetkinLocation;
}

const LocationDetailsCard: FC<LocationDetailsCardProps> = ({
  onClose,
  onSelectLocation,
  selectedLocation,
}) => {
  const messages = useMessages(messageIds);
  return (
    <Box
      padding={2}
      sx={{
        backgroundColor: 'white',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5">{selectedLocation.title}</Typography>
        <Close
          color="secondary"
          onClick={onClose}
          sx={{
            cursor: 'pointer',
          }}
        />
      </Box>
      {selectedLocation.info_text && (
        <Typography color="secondary">{selectedLocation.info_text}</Typography>
      )}
      <Box display="flex" justifyContent="flex-end" paddingTop={2}>
        <Button onClick={onSelectLocation} variant="contained">
          {messages.locationModal.useLocation()}
        </Button>
      </Box>
    </Box>
  );
};

export default LocationDetailsCard;
