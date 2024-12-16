import { FC, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Fade,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Switch,
  Typography,
} from '@mui/material';
import { CalendarMonthOutlined, Clear, Search } from '@mui/icons-material';
import {
  DateRange,
  DateRangeCalendar,
  DateRangePickerDay,
} from '@mui/x-date-pickers-pro';
import dayjs, { Dayjs } from 'dayjs';
import { FormattedDate, FormattedDateTimeRange } from 'react-intl';

import useAllEvents from 'features/events/hooks/useAllEvents';
import EventListItem from './EventListItem';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { ZetkinEventWithStatus } from '../types';
import ZUIDate from 'zui/ZUIDate';
import useIncrementalDelay from '../hooks/useIncrementalDelay';
import FilterButton from './FilterButton';
import DrawerModal from './DrawerModal';
import { getContrastColor } from 'utils/colorUtils';

const DatesFilteredBy: FC<{ end: Dayjs | null; start: Dayjs }> = ({
  start,
  end,
}) => {
  if (!end) {
    return <FormattedDate day="numeric" month="short" value={start.toDate()} />;
  } else {
    return (
      <FormattedDateTimeRange
        day="numeric"
        from={start.toDate()}
        month="short"
        to={end.toDate()}
      />
    );
  }
};

const AllEventsList: FC = () => {
  const allEvents = useAllEvents();
  const nextDelay = useIncrementalDelay();

  const [drawerContent, setDrawerContent] = useState<
    'orgs' | 'calendar' | null
  >(null);
  const [orgIdsToFilterBy, setOrgIdsToFilterBy] = useState<number[]>([]);
  const [customDatesToFilterBy, setCustomDatesToFilterBy] = useState<
    DateRange<Dayjs>
  >([null, null]);
  const [dateFilterState, setDateFilterState] = useState<
    'today' | 'tomorrow' | 'thisWeek' | 'custom' | null
  >(null);

  const orgs = [
    ...new Map(
      allEvents
        .map((event) => event.organization)
        .map((org) => [org['id'], org])
    ).values(),
  ];

  const getDateRange = (): [Dayjs | null, Dayjs | null] => {
    const today = dayjs();
    if (!dateFilterState || dateFilterState == 'custom') {
      return customDatesToFilterBy;
    } else if (dateFilterState == 'today') {
      return [today, null];
    } else if (dateFilterState == 'tomorrow') {
      return [today.add(1, 'day'), null];
    } else {
      //dateFilterState is 'thisWeek'
      return [today.startOf('week'), today.endOf('week')];
    }
  };

  const filteredEvents = allEvents
    .filter((event) => {
      if (orgIdsToFilterBy.length == 0) {
        return true;
      }
      return orgIdsToFilterBy.includes(event.organization.id);
    })
    .filter((event) => {
      if (
        !dateFilterState ||
        (dateFilterState == 'custom' && !customDatesToFilterBy[0])
      ) {
        return true;
      }

      const [start, end] = getDateRange();
      const eventStart = dayjs(event.start_time);
      const eventEnd = dayjs(event.end_time);

      if (!end) {
        const isOngoing = eventStart.isBefore(start) && eventEnd.isAfter(start);
        const startsOnSelectedDay = eventStart.isSame(start, 'day');
        const endsOnSelectedDay = eventEnd.isSame(start, 'day');
        return isOngoing || startsOnSelectedDay || endsOnSelectedDay;
      } else {
        const isOngoing =
          eventStart.isBefore(start, 'day') && eventEnd.isAfter(end, 'day');
        const startsInPeriod =
          (eventStart.isSame(start, 'day') ||
            eventStart.isAfter(start, 'day')) &&
          (eventStart.isSame(end, 'day') || eventStart.isBefore(end, 'day'));
        const endsInPeriod =
          (eventEnd.isSame(start, 'day') || eventEnd.isAfter(start, 'day')) &&
          (eventEnd.isBefore(end, 'day') || eventEnd.isSame(end, 'day'));
        return isOngoing || startsInPeriod || endsInPeriod;
      }
    });

  const eventsByDate = filteredEvents.reduce<
    Record<string, ZetkinEventWithStatus[]>
  >((dates, event) => {
    const eventDate = event.start_time.slice(0, 10);
    const existingEvents = dates[eventDate] || [];

    return {
      ...dates,
      [eventDate]: [...existingEvents, event],
    };
  }, {});

  const dates = Object.keys(eventsByDate).sort();

  const orgIdsWithEvents = allEvents.reduce<number[]>((orgIds, event) => {
    if (!orgIds.includes(event.organization.id)) {
      orgIds = [...orgIds, event.organization.id];
    }
    return orgIds;
  }, []);

  const moreThanOneOrgHasEvents = orgIdsWithEvents.length > 1;
  const isFiltered = orgIdsToFilterBy.length || !!dateFilterState;

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1}
      overflow="hidden"
      position="relative"
    >
      {allEvents.length != 0 && (
        <Box
          alignItems="center"
          display="flex"
          gap={1}
          maxWidth="100%"
          padding={1}
          sx={{ overflowX: 'auto' }}
        >
          {isFiltered && (
            <FilterButton
              active={true}
              onClick={() => {
                setDateFilterState(null);
                setCustomDatesToFilterBy([null, null]);
                setOrgIdsToFilterBy([]);
              }}
              round
            >
              <Clear fontSize="small" />
            </FilterButton>
          )}
          {moreThanOneOrgHasEvents && (
            <FilterButton
              active={!!orgIdsToFilterBy.length}
              onClick={() => setDrawerContent('orgs')}
            >
              <Msg
                id={messageIds.allEventsList.filterButtonLabels.organizations}
                values={{ numOrgs: orgIdsToFilterBy.length }}
              />
            </FilterButton>
          )}
          <FilterButton
            active={dateFilterState == 'custom'}
            onClick={() => {
              setDrawerContent('calendar');
            }}
          >
            {dateFilterState == 'custom' && customDatesToFilterBy[0] ? (
              <DatesFilteredBy
                end={customDatesToFilterBy[1]}
                start={customDatesToFilterBy[0]}
              />
            ) : (
              <CalendarMonthOutlined fontSize="small" />
            )}
          </FilterButton>
          <FilterButton
            active={dateFilterState == 'today'}
            onClick={() => {
              setCustomDatesToFilterBy([null, null]);
              setDateFilterState('today');
            }}
          >
            <Msg id={messageIds.allEventsList.filterButtonLabels.today} />
          </FilterButton>
          <FilterButton
            active={dateFilterState == 'tomorrow'}
            onClick={() => {
              setCustomDatesToFilterBy([null, null]);
              setDateFilterState('tomorrow');
            }}
          >
            <Msg id={messageIds.allEventsList.filterButtonLabels.tomorrow} />
          </FilterButton>
          <FilterButton
            active={dateFilterState == 'thisWeek'}
            onClick={() => {
              setCustomDatesToFilterBy([null, null]);
              setDateFilterState('thisWeek');
            }}
          >
            <Msg id={messageIds.allEventsList.filterButtonLabels.thisWeek} />
          </FilterButton>
        </Box>
      )}
      {filteredEvents.length == 0 && (
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          gap={1}
          justifyContent="center"
          marginTop={3}
          padding={2}
        >
          <Typography color="secondary">
            <Msg id={messageIds.allEventsList.emptyList.message} />
          </Typography>
          <Search color="secondary" fontSize="large" />
          {isFiltered && (
            <Button
              onClick={() => {
                setCustomDatesToFilterBy([null, null]);
                setOrgIdsToFilterBy([]);
                setDateFilterState(null);
              }}
              variant="outlined"
            >
              <Msg
                id={messageIds.allEventsList.emptyList.removeFiltersButton}
              />
            </Button>
          )}
        </Box>
      )}
      {dates.map((date) => (
        <Box key={date} paddingX={1}>
          <Fade appear in mountOnEnter style={{ transitionDelay: nextDelay() }}>
            <div>
              <Typography my={1} variant="h5">
                <ZUIDate datetime={date} />
              </Typography>
            </div>
          </Fade>
          <Fade appear in mountOnEnter style={{ transitionDelay: nextDelay() }}>
            <Box display="flex" flexDirection="column" gap={1}>
              {eventsByDate[date].map((event) => (
                <EventListItem key={event.id} event={event} />
              ))}
            </Box>
          </Fade>
        </Box>
      ))}
      <DrawerModal
        onClose={() => setDrawerContent(null)}
        open={drawerContent == 'calendar'}
      >
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          padding={1}
        >
          <Button
            disabled={!customDatesToFilterBy[0]}
            onClick={() => {
              setDateFilterState(null);
              setCustomDatesToFilterBy([null, null]);
            }}
            variant="outlined"
          >
            Clear dates
          </Button>
          <DateRangeCalendar
            calendars={1}
            disablePast
            onChange={(newDateRange) => {
              setDateFilterState('custom');
              setCustomDatesToFilterBy(newDateRange);
            }}
            slots={{
              day: (props) => {
                const day = props.day;

                const hasEvents = !!allEvents.find((event) => {
                  const eventStart = dayjs(event.start_time);
                  const eventEnd = dayjs(event.end_time);

                  const isOngoing =
                    eventStart.isBefore(day) && eventEnd.isAfter(day);
                  const startsOnSelectedDay = eventStart.isSame(day, 'day');
                  const endsOnSelectedDay = eventEnd.isSame(day, 'day');
                  return isOngoing || startsOnSelectedDay || endsOnSelectedDay;
                });

                const showHasEvents = hasEvents && !props.outsideCurrentMonth;

                return (
                  <DateRangePickerDay
                    {...props}
                    sx={(theme) => ({
                      '& .MuiDateRangePickerDay-day::before': showHasEvents
                        ? {
                            backgroundColor: props.selected
                              ? getContrastColor(theme.palette.primary.main)
                              : theme.palette.primary.main,
                            borderRadius: '1em',
                            bottom: 5,
                            content: '""',
                            height: '5px',
                            position: 'absolute',
                            width: '5px',
                          }
                        : '',
                    })}
                  />
                );
              },
            }}
            value={getDateRange()}
          />
        </Box>
      </DrawerModal>
      <DrawerModal
        onClose={() => setDrawerContent(null)}
        open={drawerContent == 'orgs'}
      >
        <List>
          {orgs.map((org) => (
            <ListItem key={org.id} sx={{ justifyContent: 'space-between' }}>
              <Box alignItems="center" display="flex">
                <ListItemAvatar>
                  <Avatar alt="icon" src={`/api/orgs/${org.id}/avatar`} />
                </ListItemAvatar>
                <ListItemText>{org.title}</ListItemText>
              </Box>
              <Switch
                checked={orgIdsToFilterBy.includes(org.id)}
                onChange={(ev, checked) => {
                  if (checked) {
                    setOrgIdsToFilterBy([...orgIdsToFilterBy, org.id]);
                  } else {
                    setOrgIdsToFilterBy(
                      orgIdsToFilterBy.filter((id) => id != org.id)
                    );
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </DrawerModal>
    </Box>
  );
};

export default AllEventsList;
