import { FC, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Divider,
  TextField,
  Typography,
} from '@mui/material';

import { ZetkinPlace } from '../types';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import usePlaceMutations from '../hooks/usePlaceMutations';
import ZUIDateTime from 'zui/ZUIDateTime';

type PlaceDialogProps = {
  dialogStep: 'place' | 'log';
  onClose: () => void;
  onLogCancel: () => void;
  onLogSave: () => void;
  onLogStart: () => void;
  open: boolean;
  orgId: number;
  place: ZetkinPlace;
};

const PlaceDialog: FC<PlaceDialogProps> = ({
  dialogStep,
  onClose,
  onLogCancel,
  onLogSave,
  onLogStart,
  open,
  orgId,
  place,
}) => {
  const updatePlace = usePlaceMutations(orgId, place.id);
  const [note, setNote] = useState('');
  const timestamp = new Date().toISOString();

  const sortedVisits = place.visits.toSorted((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    if (dateA > dateB) {
      return -1;
    } else if (dateB > dateA) {
      return 1;
    } else {
      return 0;
    }
  });

  return (
    <Dialog fullWidth maxWidth="xl" onClose={onClose} open={open}>
      <Box display="flex" flexDirection="column" height="90vh" padding={2}>
        <Box paddingBottom={1}>
          <Typography variant="h6">
            {place?.title || <Msg id={messageIds.place.empty.title} />}
          </Typography>
        </Box>
        <Divider />
        <Box flexGrow={1} overflow="hidden">
          {place && dialogStep == 'place' && (
            <Box
              display="flex"
              flexDirection="column"
              gap={1}
              height="100%"
              justifyContent="space-between"
              paddingTop={1}
            >
              <Typography variant="h6">
                <Msg id={messageIds.place.description} />
              </Typography>
              <Typography>
                {place.description || (
                  <Msg id={messageIds.place.empty.description} />
                )}
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                flexGrow={1}
                overflow="hidden"
              >
                <Typography variant="h6">
                  <Msg id={messageIds.place.activityHeader} />
                </Typography>
                <Box
                  display="flex"
                  flexDirection="column"
                  sx={{ overflowY: 'auto' }}
                >
                  {sortedVisits.length == 0 && (
                    <Msg id={messageIds.place.noActivity} />
                  )}
                  {sortedVisits.map((visit) => (
                    <Box key={visit.id} paddingTop={1}>
                      <Typography color="secondary">
                        <ZUIDateTime datetime={visit.timestamp} />
                      </Typography>
                      <Typography>{visit.note}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
          {place && dialogStep == 'log' && (
            <Box
              display="flex"
              flexDirection="column"
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
            </Box>
          )}
        </Box>
        <Box display="flex" gap={1} justifyContent="flex-end" paddingTop={1}>
          <Button
            onClick={dialogStep == 'place' ? onClose : onLogCancel}
            variant="outlined"
          >
            <Msg
              id={
                dialogStep == 'place'
                  ? messageIds.place.closeButton
                  : messageIds.place.cancelButton
              }
            />
          </Button>
          <Button
            disabled={dialogStep == 'log' && !note}
            onClick={() => {
              if (dialogStep == 'place') {
                onLogStart();
              } else if (dialogStep == 'log') {
                updatePlace({
                  ...place,
                  visits: [...place.visits, { note, timestamp }],
                });
                onLogSave();
              }
            }}
            variant="contained"
          >
            <Msg
              id={
                dialogStep == 'place'
                  ? messageIds.place.logActivityButton
                  : messageIds.place.saveButton
              }
            />
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default PlaceDialog;
