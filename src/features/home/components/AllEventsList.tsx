import { FC, ReactNode, useState } from 'react';
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
import {
  CalendarMonthOutlined,
  Clear,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { DateRange, DateRangeCalendar } from '@mui/x-date-pickers-pro';
import dayjs, { Dayjs } from 'dayjs';
import { FormattedDate, FormattedDateTimeRange } from 'react-intl';

import { getContrastColor } from 'utils/colorUtils';
import useAllEvents from 'features/events/hooks/useAllEvents';
import EventListItem from './EventListItem';
import useMemberships from 'features/organizations/hooks/useMemberships';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { ZetkinEventWithStatus } from '../types';
import ZUIDate from 'zui/ZUIDate';
import useIncrementalDelay from '../hooks/useIncrementalDelay';
import ZUIModalBackground from 'zui/ZUIModalBackground';

const FilterButton: FC<{
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  round?: boolean;
}> = ({ active, children, onClick, round }) => {
  return (
    <Box
      onClick={onClick}
      sx={(theme) => ({
        backgroundColor: active ? theme.palette.primary.main : '',
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: '2em',
        color: active
          ? getContrastColor(theme.palette.primary.main)
          : theme.palette.text.primary,
        cursor: 'pointer',
        display: 'inline-flex',
        fontSize: '13px',
        paddingX: round ? '3px' : '10px',
        paddingY: '3px',
      })}
    >
      {children}
    </Box>
  );
};

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
  const memberships = useMemberships().data;

  const [drawerContent, setDrawerContent] = useState<
    'orgs' | 'calendar' | null
  >(null);
  const [orgIdsToFilterBy, setOrgIdsToFilterBy] = useState<number[]>([]);
  const [datesToFilterBy, setDatesToFilterBy] = useState<DateRange<Dayjs>>([
    null,
    null,
  ]);

  const orgs = [
    ...new Map(
      allEvents
        .map((event) => event.organization)
        .map((org) => [org['id'], org])
    ).values(),
  ];

  const filteredEvents = allEvents
    .filter((event) => {
      if (orgIdsToFilterBy.length == 0) {
        return true;
      }
      return orgIdsToFilterBy.includes(event.organization.id);
    })
    .filter((event) => {
      if (!datesToFilterBy[0]) {
        return true;
      }

      const start = datesToFilterBy[0];
      const end = datesToFilterBy[1];

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

  const memberOfMoreThanOneOrg = memberships && memberships.length > 1;
  const showClearFilters = orgIdsToFilterBy.length || datesToFilterBy[0];

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1}
      padding={1}
      position="relative"
    >
      <Box alignItems="center" display="flex" gap={1}>
        {showClearFilters && (
          <FilterButton
            active={true}
            onClick={() => {
              setOrgIdsToFilterBy([]);
              setDatesToFilterBy([null, null]);
            }}
            round
          >
            <Clear fontSize="small" />
          </FilterButton>
        )}
        {memberOfMoreThanOneOrg && (
          <FilterButton
            active={!!orgIdsToFilterBy.length}
            onClick={() => setDrawerContent('orgs')}
          >
            <Msg
              id={messageIds.feed.filters.organizations}
              values={{ numOrgs: orgIdsToFilterBy.length }}
            />
          </FilterButton>
        )}
        <FilterButton
          active={!!datesToFilterBy[0]}
          onClick={() => setDrawerContent('calendar')}
        >
          {datesToFilterBy[0] ? (
            <DatesFilteredBy
              end={datesToFilterBy[1]}
              start={datesToFilterBy[0]}
            />
          ) : (
            <CalendarMonthOutlined fontSize="small" />
          )}
        </FilterButton>
      </Box>
      {filteredEvents.length == 0 && (
        <Box display="flex" justifyContent="center" padding={2}>
          <Typography>No events</Typography>
        </Box>
      )}
      {dates.map((date) => (
        <Box key={date}>
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
      {drawerContent && (
        <>
          <Box
            bottom={0}
            height="100%"
            left={0}
            onClick={() => setDrawerContent(null)}
            position="fixed"
            width="100%"
            zIndex={9999}
          >
            <ZUIModalBackground height="100%" width="100%" />
          </Box>
          <Box
            sx={{
              WebkitOverflowScrolling: 'touch',
              bgcolor: 'white',
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              height: 'auto',
              left: 0,
              maxHeight: '100%',
              outline: 0,
              position: 'fixed',
              right: 0,
              top: 'auto',
              width: '100%',
              zIndex: 10000,
            }}
          >
            <Box
              onClick={() => setDrawerContent(null)}
              sx={(theme) => ({
                alignItems: 'center',
                bgcolor: theme.palette.common.white,
                borderRadius: '100%',
                cursor: 'pointer',
                display: 'flex',
                height: '32px',
                justifyContent: 'center',
                left: '50%',
                position: 'absolute',
                top: -40,
                transform: 'translateX(-50%)',
                width: '32px',
              })}
            >
              <KeyboardArrowDown color="secondary" />
            </Box>
            {drawerContent == 'calendar' && (
              <Box
                alignItems="center"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                padding={1}
              >
                <Button
                  disabled={!datesToFilterBy[0]}
                  onClick={() => setDatesToFilterBy([null, null])}
                  variant="outlined"
                >
                  Clear dates
                </Button>
                <DateRangeCalendar
                  calendars={1}
                  disablePast
                  onChange={(newDateRange) => setDatesToFilterBy(newDateRange)}
                  value={datesToFilterBy}
                />
              </Box>
            )}
            {drawerContent == 'orgs' && (
              <List>
                {orgs.map((org) => (
                  <ListItem
                    key={org.id}
                    sx={{ justifyContent: 'space-between' }}
                  >
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
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default AllEventsList;
