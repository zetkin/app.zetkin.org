import { FC, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

import { Msg } from 'core/i18n';
import { ZetkinPlace } from '../types';
import usePlaceMutations from '../hooks/usePlaceMutations';
import messageIds from '../l10n/messageIds';
import ZUIDateTime from 'zui/ZUIDateTime';

type LogActivityProps = {
  onCancel: () => void;
  orgId: number;
  place: ZetkinPlace;
};

const LogActivity: FC<LogActivityProps> = ({ onCancel, orgId, place }) => {
  const updatePlace = usePlaceMutations(orgId, place.id);
  const [note, setNote] = useState('');

  const timestamp = new Date().toISOString();
  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      justifyContent="space-between"
    >
      <Box paddingTop={1}>
        <ZUIDateTime datetime={timestamp} />
        <TextField
          fullWidth
          multiline
          onChange={(ev) => setNote(ev.target.value)}
          placeholder="Note"
          sx={{ paddingTop: 1 }}
        />
      </Box>
      <Box display="flex" gap={1} justifyContent="flex-end">
        <Button onClick={onCancel} variant="outlined">
          <Msg id={messageIds.place.cancelButton} />
        </Button>
        <Button
          disabled={!note}
          onClick={() => {
            updatePlace({
              ...place,
              visits: [...place.visits, { note, timestamp }],
            });
            onCancel();
          }}
          variant="contained"
        >
          <Msg id={messageIds.place.saveButton} />
        </Button>
      </Box>
    </Box>
  );
};

export default LogActivity;
