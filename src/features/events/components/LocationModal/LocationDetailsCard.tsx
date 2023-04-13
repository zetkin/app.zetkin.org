import { Close } from '@mui/icons-material';
import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';

import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinLocation } from 'utils/types/zetkin';

interface LocationDetailsCardProps {
  onClose: () => void;
  onUseLocation: () => void;
  location: ZetkinLocation;
}

const LocationDetailsCard: FC<LocationDetailsCardProps> = ({
  onClose,
  onUseLocation,
  location,
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
        <Typography variant="h5">{location.title}</Typography>
        <Close
          color="secondary"
          onClick={() => {
            onClose();
          }}
          sx={{
            cursor: 'pointer',
          }}
        />
      </Box>
      {location.info_text && (
        <Typography color="secondary">{location.info_text}</Typography>
      )}
      <Box display="flex" justifyContent="flex-end" paddingTop={2}>
        <Button onClick={onUseLocation} variant="contained">
          {messages.locationModal.useLocation()}
        </Button>
      </Box>
    </Box>
  );
};

export default LocationDetailsCard;
