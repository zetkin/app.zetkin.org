import { CheckBoxOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { Badge, Box, Button, Divider, Paper, Typography } from '@mui/material';

import EventParticipantsModal from '../EventParticipantsModal';
import messageIds from '../../../calendar/l10n/messageIds';
import MoveCopyButtons from './MoveCopyButtons';
import { Msg } from 'core/i18n';
import { resetSelection } from 'features/events/store';
import { RootState } from 'core/store';
import SelectionBarEllipsis from '../SelectionBarEllipsis';
import useParticipantPool from 'features/events/hooks/useParticipantPool';
import {
  useAppDispatch,
  useAppSelector,
  useNumericRouteParams,
} from 'core/hooks';

const SelectionBar = () => {
  const dispatch = useAppDispatch();
  const [participantsDialogOpen, setParticipantsDialogOpen] = useState(false);
  const { affectedParticipantIds } = useParticipantPool();
  const eventList = useAppSelector((state) => state.events.eventList);
  const selectedEventIds = useAppSelector(
    (state: RootState) => state.events.selectedEventIds
  );
  const { orgId } = useNumericRouteParams();

  const handleOpenEventList = () => {
    const filteredEvents = eventList.items
      .filter(
        (item) => item.data?.id && selectedEventIds.includes(item.data.id)
      )
      .map((x) => x.data);

    const endDates = filteredEvents.map((x) => x?.end_time.slice(0, 10));
    const startDates = filteredEvents.map((x) => x?.start_time.slice(0, 10));

    const minDate = startDates.reduce((min, current) => {
      const currentDate = new Date(current || '');
      const minDate = new Date(min || '');
      return currentDate < minDate ? current : min;
    });

    const maxDate = endDates.reduce((max, current) => {
      const currentDate = new Date(current || '');
      const maxDate = new Date(max || '');

      return maxDate > currentDate ? max : current;
    });

    window
      .open(
        `/organize/${orgId}/projects/eventlist?minDate=${
          minDate || ''
        }&maxDate=${maxDate || ''}&ids=${selectedEventIds.join(',')}`,
        '_blank'
      )
      ?.focus();
  };

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
                <Button onClick={handleOpenEventList} variant="text">
                  <Msg id={messageIds.selectionBar.openEventList} />
                </Button>

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
