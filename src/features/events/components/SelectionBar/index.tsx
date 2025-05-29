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
import dayjs from 'dayjs';

import { TimeScale } from 'features/calendar/types';
import EventParticipantsModal from '../EventParticipantsModal';
import messageIds from '../../../calendar/l10n/messageIds';
import MoveCopyButtons from './MoveCopyButtons';
import { Msg } from 'core/i18n';
import { eventsSelected, resetSelection } from 'features/events/store';
import { RootState } from 'core/store';
import SelectionBarEllipsis from '../SelectionBarEllipsis';
import useParticipantPool from 'features/events/hooks/useParticipantPool';
import {
  useAppDispatch,
  useAppSelector,
  useNumericRouteParams,
} from 'core/hooks';
import useMonthCalendarEvents from 'features/calendar/hooks/useMonthCalendarEvents';
import useWeekCalendarEvents from 'features/calendar/hooks/useWeekCalendarEvents';
import { useFocusDate } from 'utils/hooks/useFocusDate';
import useDayCalendarEvents from 'features/calendar/hooks/useDayCalendarEvents';

const SelectionBar = () => {
  const dispatch = useAppDispatch();
  const [participantsDialogOpen, setParticipantsDialogOpen] = useState(false);
  const { affectedParticipantIds } = useParticipantPool();
  const calendarStore = useAppSelector((state: RootState) => state.calendar);
  const { focusDate } = useFocusDate();

  const { orgId, campId } = useNumericRouteParams();
  const monthViewSpan = useMemo(
    () => ({
      endDate:
        calendarStore.monthViewSpan.endDate !== undefined
          ? dayjs(calendarStore.monthViewSpan.endDate).toDate()
          : undefined,
      startDate:
        calendarStore.monthViewSpan.startDate !== undefined
          ? dayjs(calendarStore.monthViewSpan.startDate).toDate()
          : undefined,
    }),
    [calendarStore.monthViewSpan]
  );
  const weekViewDates = useMemo(
    () => calendarStore.weekViewDates.map((d) => dayjs(d).toDate()),
    [calendarStore.weekViewDates]
  );

  const monthCalendarEvents = useMonthCalendarEvents({
    campaignId: campId,
    endDate: monthViewSpan.endDate,
    maxPerDay: calendarStore.maxMonthEventsPerDay,
    orgId,
    startDate: monthViewSpan.startDate,
  });

  const weekCalendarEvents = useWeekCalendarEvents({
    campaignId: campId,
    dates: weekViewDates,
    orgId,
  });

  const { activities: dayCalendarEvents } = useDayCalendarEvents(focusDate);

  function getIdsToSelect() {
    const eventsToSelect = new Set<number>();
    if (calendarStore.timeScale === TimeScale.MONTH) {
      monthCalendarEvents
        .flatMap((event) => event.clusters)
        .flatMap((cluster) => cluster.events)
        .map((event) => event.id)
        .forEach((id) => eventsToSelect.add(id));
    } else if (calendarStore.timeScale === TimeScale.WEEK) {
      weekCalendarEvents
        .flatMap((events) => events.lanes)
        .flatMap((lanes) => lanes)
        .flatMap((lane) => lane.events)
        .map((event) => event.id)
        .forEach((id) => eventsToSelect.add(id));
    } else if (calendarStore.timeScale === TimeScale.DAY) {
      dayCalendarEvents
        .flatMap((event) => event[1])
        .flatMap((e) => e.events)
        .map((e) => e.data.id)
        .forEach((id) => eventsToSelect.add(id));
    }
    return Array.from(eventsToSelect);
  }

  const selectedEventIds = useAppSelector(
    (state: RootState) => state.events.selectedEventIds
  );

  const handleDeselect = () => {
    dispatch(resetSelection());
  };

  const handleSelectAll = () => {
    const eventIds = getIdsToSelect();
    dispatch(eventsSelected(eventIds));
  };

  const canSelectAll = useMemo(() => {
    const visibleEventIds = getIdsToSelect();
    if (selectedEventIds.length !== visibleEventIds.length) {
      return true;
    }
    const canSelect = !visibleEventIds.every((v) =>
      selectedEventIds.includes(v)
    );
    return canSelect;
  }, [
    selectedEventIds,
    monthCalendarEvents,
    weekCalendarEvents,
    dayCalendarEvents,
  ]);

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
