import { CheckBoxOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';

import EventParticipantsModal from '../EventParticipantsModal';
import messageIds from '../../../calendar/l10n/messageIds';
import MoveCopyButtons from './MoveCopyButtons';
import { Msg } from 'core/i18n';
import { resetSelection } from 'features/events/store';
import { RootState } from 'core/store';
import SelectionBarEllipsis from '../SelectionBarEllipsis';
import { useAppDispatch, useAppSelector } from 'core/hooks';

const SelectionBar = () => {
  const dispatch = useAppDispatch();
  const [participantsDialogOpen, setParticipantsDialogOpen] = useState(false);
  const selectedEventIds = useAppSelector(
    (state: RootState) => state.events.selectedEventIds
  );

  const handleDeselect = () => {
    dispatch(resetSelection());
  };

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 200,
      }}
    >
      {selectedEventIds.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper
            elevation={3}
            sx={{
              backgroundColor: 'white',
              borderRadius: '5px',
              bottom: 15,
              padding: 2,
              width: '100%',
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Box alignItems="center" display="flex">
                <CheckBoxOutlined color="primary" />
                <Typography color="primary" sx={{ px: 0.4 }}>
                  {selectedEventIds.length}
                </Typography>
                <Button color="primary" onClick={handleDeselect} sx={{ mr: 1 }}>
                  <Msg id={messageIds.selectionBar.deselect} />
                </Button>
                <Divider orientation="vertical" variant="fullWidth" />
                {/* TODO: Implement edit events                
                <Button
                  color="primary"
                  sx={{ borderRadius: '5px', ml: 1.5 }}
                  variant="outlined"
                >
                  <Msg id={messageIds.selectionBar.editEvents} />
                </Button> */}
              </Box>
              <Box
                alignItems="center"
                display="flex"
                gap={1}
                justifyContent="center"
              >
                <Button
                  onClick={() => setParticipantsDialogOpen(true)}
                  variant="outlined"
                >
                  <Msg id={messageIds.selectionBar.editParticipants} />
                </Button>
              </Box>
              <Box
                alignItems="center"
                display="flex"
                gap={1}
                justifyContent="center"
              >
                <Divider orientation="vertical" variant="fullWidth" />
                <MoveCopyButtons />
                <SelectionBarEllipsis />
              </Box>
            </Box>
          </Paper>
          <EventParticipantsModal
            onClose={() => {
              setParticipantsDialogOpen(false);
            }}
            open={participantsDialogOpen}
          />
        </Box>
      )}
    </Box>
  );
};

export default SelectionBar;
