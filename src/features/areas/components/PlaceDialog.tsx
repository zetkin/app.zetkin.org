import { FC } from 'react';
import { Box, Dialog, Divider, Typography } from '@mui/material';

import PlaceDetails from './PlaceDetails';
import LogActivity from './LogActivity';
import { ZetkinPlace } from '../types';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type PlaceDialogProps = {
  inLogMode: boolean;
  onClose: () => void;
  onLogCancel: () => void;
  onLogStart: () => void;
  open: boolean;
  orgId: number;
  place: ZetkinPlace | null;
};

const PlaceDialog: FC<PlaceDialogProps> = ({
  inLogMode,
  onClose,
  onLogCancel,
  onLogStart,
  open,
  orgId,
  place,
}) => {
  return (
    <Dialog fullWidth maxWidth="xl" onClose={onClose} open={open}>
      <Box display="flex" flexDirection="column" height="90vh" padding={2}>
        <Box paddingBottom={1}>
          <Typography variant="h6">
            {place?.title || <Msg id={messageIds.place.empty.title} />}
          </Typography>
        </Box>
        <Divider />
        {place && !inLogMode && (
          <PlaceDetails
            onClose={onClose}
            onLogActivity={onLogStart}
            place={place}
          />
        )}
        {place && inLogMode && (
          <LogActivity onCancel={onLogCancel} orgId={orgId} place={place} />
        )}
      </Box>
    </Dialog>
  );
};

export default PlaceDialog;
