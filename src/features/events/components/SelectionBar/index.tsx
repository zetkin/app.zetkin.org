import { CheckBoxOutlined } from '@mui/icons-material';
import { useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Paper,
  Typography,
} from '@mui/material';

import { eventsSelected, resetSelection } from 'features/events/store';
import useParticipantPool from 'features/events/hooks/useParticipantPool';
import { RootState } from 'core/store';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { Msg } from 'core/i18n';
import useVisibleEventIds from 'features/calendar/hooks/useVisibleEventIds';
import EventParticipantsModal from '../EventParticipantsModal';
import messageIds from '../../../calendar/l10n/messageIds';
import MoveCopyButtons from './MoveCopyButtons';
import SelectionBarEllipsis from '../SelectionBarEllipsis';

const SelectionBar = () => {
  const dispatch = useAppDispatch();
  const [participantsDialogOpen, setParticipantsDialogOpen] = useState(false);
  const { affectedParticipantIds } = useParticipantPool();

  const visibleEventIds = useVisibleEventIds();
  const selectedEventIds = useAppSelector(
    (state: RootState) => state.events.selectedEventIds
  );

  const handleDeselect = () => {
    dispatch(resetSelection());
  };

  const handleSelectAll = () => {
    dispatch(eventsSelected(visibleEventIds));
  };

  const canSelectAll = useMemo(() => {
    if (selectedEventIds.length !== visibleEventIds.length) {
      return true;
    }
    const canSelect = !visibleEventIds.every((v) =>
      selectedEventIds.includes(v)
    );
    return canSelect;
  }, [selectedEventIds]);

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
                <ButtonGroup sx={{ marginLeft: '4px' }}>
                  <Button
                    disabled={!canSelectAll}
                    onClick={handleSelectAll}
                    variant={'outlined'}
                  >
                    <Msg id={messageIds.selectionBar.selectAll} />
                  </Button>
                  <Button onClick={handleDeselect} variant={'outlined'}>
                    <Msg id={messageIds.selectionBar.deselect} />
                  </Button>
                </ButtonGroup>
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
                <Badge
                  badgeContent={affectedParticipantIds.length}
                  color="primary"
                >
                  <Button
                    onClick={() => setParticipantsDialogOpen(true)}
                    variant="outlined"
                  >
                    <Msg id={messageIds.selectionBar.editParticipants} />
                  </Button>
                </Badge>
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
