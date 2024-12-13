import { FC, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Switch,
} from '@mui/material';
import { CalendarMonthOutlined, KeyboardArrowDown } from '@mui/icons-material';
import { DateRange, DateRangeCalendar } from '@mui/x-date-pickers-pro';
import dayjs, { Dayjs } from 'dayjs';

import { getContrastColor } from 'utils/colorUtils';
import useAllEvents from 'features/events/hooks/useAllEvents';
import EventListItem from './EventListItem';
import useMemberships from 'features/organizations/hooks/useMemberships';

const AllEventsList: FC = () => {
  const allEvents = useAllEvents();
  const memberships = useMemberships().data;

  const [drawerContent, setDrawerContent] = useState<
    'orgs' | 'calendar' | null
  >(null);
  const [orgIdsToFilterBy, setOrgIdsToFilterBy] = useState<number[]>([]);
  const [datesToFilterBy, setDatesToFilterBy] = useState<DateRange<Dayjs>>();

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
      if (!datesToFilterBy) {
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

  const memberOfMoreThanOneOrg = memberships && memberships.length > 1;

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1}
      padding={1}
      position="relative"
    >
      <Box alignItems="center" display="flex" gap={1}>
        {memberOfMoreThanOneOrg && (
          <Box
            onClick={() => setDrawerContent('orgs')}
            sx={(theme) => ({
              backgroundColor: orgIdsToFilterBy.length
                ? theme.palette.primary.main
                : '',
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: '2em',
              color: orgIdsToFilterBy.length
                ? getContrastColor(theme.palette.primary.main)
                : theme.palette.text.primary,
              cursor: 'pointer',
              display: 'inline-flex',
              paddingX: 1,
              paddingY: 1,
            })}
          >{`Organization ${orgIdsToFilterBy.length || ''}`}</Box>
        )}
        <Box
          onClick={() => setDrawerContent('calendar')}
          sx={(theme) => ({
            backgroundColor: datesToFilterBy?.length
              ? theme.palette.primary.main
              : '',
            border: `2px solid ${theme.palette.primary.main}`,
            borderRadius: '2em',
            color: datesToFilterBy?.length
              ? getContrastColor(theme.palette.primary.main)
              : theme.palette.text.primary,
            cursor: 'pointer',
            display: 'inline-flex',
            paddingX: 2,
            paddingY: 1,
          })}
        >
          <CalendarMonthOutlined />
        </Box>
      </Box>
      {filteredEvents.map((event) => (
        <EventListItem key={event.id} event={event} />
      ))}
      {drawerContent && (
        <>
          <Box
            bgcolor="black"
            bottom={0}
            height="100%"
            left={0}
            onClick={() => setDrawerContent(null)}
            position="fixed"
            sx={{ opacity: '30%' }}
            width="100%"
            zIndex={9999}
          />
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
                  disabled={!datesToFilterBy}
                  onClick={() => setDatesToFilterBy(undefined)}
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
