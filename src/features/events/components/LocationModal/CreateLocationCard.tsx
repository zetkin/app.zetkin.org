import { Close } from '@mui/icons-material';
import { Box, Button, TextField, Typography } from '@mui/material';
import { FC, useState } from 'react';

import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinLocation } from 'utils/types/zetkin';

interface CreateLocationCardProps {
  onClose: () => void;
  onCreateLocation: (newLocation: Partial<ZetkinLocation>) => void;
  pendingLocation: Pick<ZetkinLocation, 'lat' | 'lng'>;
}

const CreateLocationCard: FC<CreateLocationCardProps> = ({
  onClose,
  onCreateLocation,
  pendingLocation,
}) => {
  const messages = useMessages(messageIds);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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
        <Typography variant="h5">
          {messages.locationModal.createLocation()}
        </Typography>
        <Close
          color="secondary"
          onClick={onClose}
          sx={{
            cursor: 'pointer',
          }}
        />
      </Box>
      <Box
        display="flex"
        flex={1}
        flexDirection="column"
        justifyContent="flex-start"
      >
        <TextField
          fullWidth
          label={messages.locationModal.title()}
          onChange={(ev) => setTitle(ev.target.value)}
          sx={{ marginTop: 2 }}
          value={title}
        />
        <TextField
          fullWidth
          label={messages.locationModal.description()}
          onChange={(ev) => setDescription(ev.target.value)}
          sx={{ marginTop: 2 }}
          value={description}
        />
      </Box>
      <Box display="flex" justifyContent="space-between" paddingTop={2}>
        <Button onClick={onClose}>{messages.locationModal.cancel()}</Button>
        <Button
          disabled={!title}
          onClick={() =>
            onCreateLocation({
              info_text: description,
              lat: pendingLocation.lat,
              lng: pendingLocation.lng,
              title,
            })
          }
          variant="contained"
        >
          {messages.locationModal.save()}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateLocationCard;
