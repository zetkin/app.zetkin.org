'use client';

import dayjs, { Dayjs } from 'dayjs';
import {
  Avatar,
  Box,
  Fade,
  List,
  ListItem,
  ListItemAvatar,
  Switch,
} from '@mui/material';
import { FC, useMemo, useState } from 'react';
import {
  DateRange,
  DateRangeCalendar,
  DateRangePickerDay,
} from '@mui/x-date-pickers-pro';
import { useIntl } from 'react-intl';
import { Clear, CalendarMonthOutlined, Search } from '@mui/icons-material';

import useUpcomingOrgEvents from '../hooks/useUpcomingOrgEvents';
import EventListItem from 'features/home/components/EventListItem';
import { ZetkinEventWithStatus } from 'features/home/types';
import useIncrementalDelay from 'features/home/hooks/useIncrementalDelay';
import ZUIDate from 'zui/ZUIDate';
import SubOrgEventBlurb from '../components/SubOrgEventBlurb';
import { ZetkinEvent } from 'utils/types/zetkin';
import useUser from 'core/hooks/useUser';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useMyEvents from 'features/events/hooks/useMyEvents';
import NoEventsBlurb from '../components/NoEventsBlurb';
import ZUIText from 'zui/components/ZUIText';
import ZUIModal from 'zui/components/ZUIModal';
import ZUIDivider from 'zui/components/ZUIDivider';
import ZUIFilterButton from 'zui/components/ZUIFilterButton';
import ZUIButton from '../../../zui/components/ZUIButton';
import ZUIDrawerModal from '../../../zui/components/ZUIDrawerModal';
import { getContrastColor } from '../../../utils/colorUtils';

type Props = {
  orgId: number;
};

const PublicOrgPage: FC<Props> = ({ orgId }) => {
  const intl = useIntl();
  const messages = useMessages(messageIds);
  const [postAuthEvent, setPostAuthEvent] = useState<ZetkinEvent | null>(null);
  const [includeSubOrgs, setIncludeSubOrgs] = useState(false);
  const nextDelay = useIncrementalDelay();
  const orgEvents = useUpcomingOrgEvents(orgId);
  const myEvents = useMyEvents();
  const user = useUser();
  const [orgIdsToFilterBy, setOrgIdsToFilterBy] = useState<number[]>([]);
  const [customDatesToFilterBy, setCustomDatesToFilterBy] = useState<
    DateRange<Dayjs>
  >([null, null]);

  const allEvents = useMemo(() => {
    return orgEvents.map<ZetkinEventWithStatus>((event) => ({
      ...event,
      status:
        myEvents.find((userEvent) => userEvent.id == event.id)?.status || null,
    }));
  }, [orgEvents]);

  const [drawerContent, setDrawerContent] = useState<
    'orgs' | 'calendar' | null
  >(null);

  const [dateFilterState, setDateFilterState] = useState<
    'today' | 'tomorrow' | 'thisWeek' | 'custom' | null
  >(null);

  const orgs = [
    ...new Map(
      allEvents
        .map((event) => event.organization)
        .map((org) => [org['id'], org])
    ).values(),
  ].sort((a, b) => a.title.localeCompare(b.title));

  const isFiltered = orgIdsToFilterBy.length || !!dateFilterState;

  const getDatesFilteredBy = (end: Dayjs | null, start: Dayjs) => {
    if (!end) {
      return intl.formatDate(start.toDate(), {
        day: 'numeric',
        month: 'short',
      });
    } else {
      return intl.formatDateTimeRange(start.toDate(), end.toDate(), {
        day: 'numeric',
        month: 'short',
      });
    }
  };

  const orgIdsWithEvents = allEvents.reduce<number[]>((orgIds, event) => {
    if (!orgIds.includes(event.organization.id)) {
      orgIds = [...orgIds, event.organization.id];
    }
    return orgIds;
  }, []);

  const moreThanOneOrgHasEvents = orgIdsWithEvents.length > 1;

  const filters = [
    {
      active: dateFilterState == 'today',
      key: 'today',
      label: messages.allEventsList.filterButtonLabels.today(),
      onClick: () => {
        setCustomDatesToFilterBy([null, null]);
        setDateFilterState('today');
      },
    },
    {
      active: dateFilterState == 'tomorrow',
      key: 'tomorrow',
      label: messages.allEventsList.filterButtonLabels.tomorrow(),
      onClick: () => {
        setCustomDatesToFilterBy([null, null]);
        setDateFilterState('tomorrow');
      },
    },
    {
      active: dateFilterState == 'thisWeek',
      key: 'thisWeek',
      label: messages.allEventsList.filterButtonLabels.thisWeek(),
      onClick: () => {
        setCustomDatesToFilterBy([null, null]);
        setDateFilterState('thisWeek');
      },
    },
    {
      active: dateFilterState == 'custom',
      key: 'custom',
      label:
        dateFilterState == 'custom' && customDatesToFilterBy[0]
          ? getDatesFilteredBy(
              customDatesToFilterBy[1],
              customDatesToFilterBy[0]
            )
          : CalendarMonthOutlined,
      onClick: () => {
        setDrawerContent('calendar');
      },
    },
    ...(moreThanOneOrgHasEvents
      ? [
          {
            active: !!orgIdsToFilterBy.length,
            key: 'orgs',
            label: messages.allEventsList.filterButtonLabels.organizations({
              numOrgs: orgIdsToFilterBy.length,
            }),
            onClick: () => setDrawerContent('orgs'),
          },
        ]
      : []),
  ].sort((a, b) => {
    if (a.active && !b.active) {
      return -1;
    } else if (!a.active && b.active) {
      return 1;
    } else {
      return 0;
    }
  });

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

  const topOrgEvents = allEvents.filter(
    (event) => event.organization.id == orgId
  );

  const events =
    includeSubOrgs || topOrgEvents.length == 0 ? allEvents : topOrgEvents;

  const eventsByDate = filteredEvents.reduce<
    Record<string, ZetkinEventWithStatus[]>
  >((dates, event) => {
    const eventDate = event.start_time.slice(0, 10);
    const existingEvents = dates[eventDate] || [];

    const firstFilterDate = dayjs().format('YYYY-MM-DD');

    const dateToSortAs =
      firstFilterDate && eventDate < firstFilterDate
        ? firstFilterDate
        : eventDate;

    return {
      ...dates,
      [dateToSortAs]: [...existingEvents, event],
    };
  }, {});

  const dates = Object.keys(eventsByDate).sort();
  const indexForSubOrgsButton = Math.min(1, dates.length - 1);
  const showSubOrgBlurb =
    orgIdsToFilterBy.length == 0 && allEvents.length > events.length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, my: 2 }}>
      {!dates.length && (
        <Box key="empty">
          <NoEventsBlurb orgId={orgId} />
        </Box>
      )}
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
            <ZUIFilterButton
              active={true}
              circular
              label={Clear}
              onClick={() => {
                setDateFilterState(null);
                setCustomDatesToFilterBy([null, null]);
                setOrgIdsToFilterBy([]);
              }}
            />
          )}
          {filters.map((filter) => (
            <ZUIFilterButton
              key={filter.key}
              active={filter.active}
              label={filter.label}
              onClick={filter.onClick}
            />
          ))}
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
          <ZUIText color="secondary">
            <Msg id={messageIds.allEventsList.emptyList.message} />
          </ZUIText>
          <Search color="secondary" fontSize="large" />
          {isFiltered && (
            <ZUIButton
              label={messages.allEventsList.emptyList.removeFiltersButton()}
              onClick={() => {
                setCustomDatesToFilterBy([null, null]);
                setOrgIdsToFilterBy([]);
                setDateFilterState(null);
              }}
              variant="secondary"
            />
          )}
        </Box>
      )}
      {dates.map((date, index) => (
        <Box key={date} paddingX={1}>
          <Fade appear in mountOnEnter style={{ transitionDelay: nextDelay() }}>
            <Box sx={{ mb: 2, mt: 3 }}>
              <ZUIText variant="headingMd">
                <ZUIDate datetime={date} />
              </ZUIText>
            </Box>
          </Fade>
          <Fade appear in mountOnEnter style={{ transitionDelay: nextDelay() }}>
            <Box display="flex" flexDirection="column" gap={1}>
              {eventsByDate[date].map((event) => (
                <EventListItem
                  key={event.id}
                  event={event}
                  onClickSignUp={(ev) => {
                    if (!user) {
                      setPostAuthEvent(event);
                      ev.preventDefault();
                    }
                  }}
                />
              ))}
            </Box>
          </Fade>
          {index == indexForSubOrgsButton && showSubOrgBlurb && (
            <Fade
              appear
              in
              mountOnEnter
              style={{ transitionDelay: nextDelay() }}
            >
              <Box sx={{ my: 4 }}>
                <ZUIDivider />
                <SubOrgEventBlurb
                  onClickShow={() => setIncludeSubOrgs(true)}
                  subOrgEvents={allEvents.filter(
                    (event) => event.organization.id != orgId
                  )}
                />
                <ZUIDivider />
              </Box>
            </Fade>
          )}
        </Box>
      ))}
      <ZUIDrawerModal
        onClose={() => setDrawerContent(null)}
        open={drawerContent == 'calendar'}
      >
        <Box
          alignItems="center"
          display="flex"
          justifyContent="center"
          padding={1}
        >
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
      </ZUIDrawerModal>
      <ZUIDrawerModal
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
                <ZUIText>{org.title}</ZUIText>
              </Box>
              <Switch
                checked={orgIdsToFilterBy.includes(org.id)}
                onChange={(_event, checked) => {
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
      </ZUIDrawerModal>
      <ZUIModal
        onClose={() => setPostAuthEvent(null)}
        open={!!postAuthEvent}
        primaryButton={{
          href: `/login?redirect=${encodeURIComponent(`/o/${orgId}`)}`,
          label: messages.authDialog.loginButton(),
        }}
        secondaryButton={{
          label: messages.authDialog.cancelButton(),
          onClick: () => setPostAuthEvent(null),
        }}
        size="small"
        title={messages.authDialog.label()}
      >
        <Box sx={{ paddingTop: '0.75rem' }}>
          <ZUIText>
            <Msg id={messageIds.authDialog.content} />
          </ZUIText>
        </Box>
      </ZUIModal>
    </Box>
  );
};

export default PublicOrgPage;
