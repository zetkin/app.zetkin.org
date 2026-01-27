import { FC, useCallback, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Fade,
  List,
  ListItem,
  ListItemAvatar,
  Switch,
} from '@mui/material';
import { CalendarMonthOutlined, Clear, Search } from '@mui/icons-material';
import {
  DateRange,
  DateRangeCalendar,
  DateRangePickerDay,
} from '@mui/x-date-pickers-pro';
import dayjs, { Dayjs } from 'dayjs';
import { useIntl } from 'react-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import useAllEvents from 'features/events/hooks/useAllEvents';
import EventListItem from './EventListItem';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { ZetkinEventWithStatus } from '../types';
import ZUIDate from 'zui/ZUIDate';
import useIncrementalDelay from '../hooks/useIncrementalDelay';
import { getContrastColor } from 'utils/colorUtils';
import ZUIFilterButton from 'zui/components/ZUIFilterButton';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';
import ZUIDrawerModal from 'zui/components/ZUIDrawerModal';
import { useEventTypeFilter } from 'features/events/hooks/useEventTypeFilter';

const AllEventsList: FC = () => {
  const intl = useIntl();
  const messages = useMessages(messageIds);
  const allEvents = useAllEvents();
  const nextDelay = useIncrementalDelay();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [drawerContent, setDrawerContent] = useState<
    'orgs' | 'calendar' | 'eventTypes' | null
  >(null);

  const orgIdsToFilterBy = useMemo(
    () => searchParams?.get('orgs')?.split(',').map(Number) || [],
    [searchParams]
  );
  const eventTypesToFilterBy = useMemo(
    () => searchParams?.get('types')?.split(',').filter(Boolean) || [],
    [searchParams]
  );
  const dateFilterState = useMemo(
    () =>
      (searchParams?.get('date') as
        | 'today'
        | 'tomorrow'
        | 'thisWeek'
        | 'custom'
        | null) || null,
    [searchParams]
  );

  const customDatesToFilterBy: DateRange<Dayjs> = useMemo(() => {
    const rangeParam = searchParams?.get('range');
    if (rangeParam) {
      return rangeParam.split(',').map((d) => (d ? dayjs(d) : null)) as [
        Dayjs | null,
        Dayjs | null
      ];
    }
    return [null, null];
  }, [searchParams]);

  const setFilters = useCallback(
    (filters: {
      date?: string | null;
      orgs?: number[] | null;
      range?: DateRange<Dayjs> | null;
      types?: string[] | null;
    }) => {
      const params = new URLSearchParams(searchParams?.toString());

      if (filters.orgs === null) {
        params.delete('orgs');
      } else if (filters.orgs) {
        params.set('orgs', filters.orgs.join(','));
      }

      if (filters.types === null) {
        params.delete('types');
      } else if (filters.types) {
        params.set('types', filters.types.join(','));
      }

      if (filters.date === null) {
        params.delete('date');
      } else if (filters.date !== undefined) {
        params.set('date', filters.date);
      }

      if (filters.range !== undefined) {
        if (filters.range === null) {
          params.delete('range');
        } else {
          params.set(
            'range',
            filters.range
              .map((d) => (d ? d.format('YYYY-MM-DD') : ''))
              .join(',')
          );
        }
      }

      router.push(pathname + '?' + params.toString());
    },
    [pathname, router, searchParams, dateFilterState]
  );

  const eventTypeFilter = useEventTypeFilter(allEvents, {
    eventTypeLabelsToFilterBy: eventTypesToFilterBy,
    setEventTypeLabelsToFilterBy: (types: string[]) => setFilters({ types }),
  });

  const orgs = [
    ...new Map(
      allEvents
        .map((event) => event.organization)
        .map((org) => [org['id'], org])
    ).values(),
  ].sort((a, b) => a.title.localeCompare(b.title));

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
    })
    .filter(eventTypeFilter.getShouldShowEvent);

  const eventsByDate = filteredEvents.reduce<
    Record<string, ZetkinEventWithStatus[]>
  >((dates, event) => {
    const eventDate = event.start_time.slice(0, 10);
    const existingEvents = dates[eventDate] || [];

    const dateRange = getDateRange();
    const firstFilterDate = dateRange[0]?.format('YYYY-MM-DD');

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

  const orgIdsWithEvents = allEvents.reduce<number[]>((orgIds, event) => {
    if (!orgIds.includes(event.organization.id)) {
      orgIds = [...orgIds, event.organization.id];
    }
    return orgIds;
  }, []);

  const moreThanOneOrgHasEvents = orgIdsWithEvents.length > 1;
  const isFiltered =
    orgIdsToFilterBy.length || !!dateFilterState || eventTypeFilter.isFiltered;

  const clearFilters = () =>
    setFilters({
      date: null,
      orgs: null,
      range: null,
      types: null,
    });

  const filters = [
    {
      active: dateFilterState == 'today',
      key: 'today',
      label: messages.allEventsList.filterButtonLabels.today(),
      onClick: () => {
        setFilters({
          date: 'today',
          range: null,
        });
      },
    },
    {
      active: dateFilterState == 'tomorrow',
      key: 'tomorrow',
      label: messages.allEventsList.filterButtonLabels.tomorrow(),
      onClick: () => {
        setFilters({
          date: 'tomorrow',
          range: null,
        });
      },
    },
    {
      active: dateFilterState == 'thisWeek',
      key: 'thisWeek',
      label: messages.allEventsList.filterButtonLabels.thisWeek(),
      onClick: () => {
        setFilters({
          date: 'thisWeek',
          range: null,
        });
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
    ...(eventTypeFilter.shouldShowFilter
      ? [
          {
            active: eventTypeFilter.isFiltered,
            key: 'eventTypes',
            label: eventTypeFilter.filterButtonLabel,
            onClick: () => setDrawerContent('eventTypes'),
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
            <ZUIFilterButton
              active={true}
              circular
              label={Clear}
              onClick={clearFilters}
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
              onClick={clearFilters}
              variant="secondary"
            />
          )}
        </Box>
      )}
      {dates.map((date) => (
        <Box key={date} paddingX={1}>
          <Fade appear in mountOnEnter style={{ transitionDelay: nextDelay() }}>
            <div>
              <ZUIText my={1} variant="headingMd">
                <ZUIDate datetime={date} />
              </ZUIText>
            </div>
          </Fade>
          <Fade appear in mountOnEnter style={{ transitionDelay: nextDelay() }}>
            <Box display="flex" flexDirection="column" gap={1}>
              {eventsByDate[date].map((event) => (
                <EventListItem
                  key={event.id}
                  event={event}
                  href={`/o/${event.organization.id}/events/${event.id}`}
                />
              ))}
            </Box>
          </Fade>
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
              setFilters({
                date: 'custom',
                range: newDateRange,
              });
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
                    setFilters({ orgs: [...orgIdsToFilterBy, org.id] });
                  } else {
                    setFilters({
                      orgs: orgIdsToFilterBy.filter((id) => id != org.id),
                    });
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </ZUIDrawerModal>
      <ZUIDrawerModal
        onClose={() => setDrawerContent(null)}
        open={drawerContent == 'eventTypes'}
      >
        <List>
          {eventTypeFilter.eventTypeLabels.map((eventType) => (
            <ListItem key={eventType} sx={{ justifyContent: 'space-between' }}>
              <Box alignItems="center" display="flex">
                <ZUIText>{eventType}</ZUIText>
              </Box>
              <Switch
                checked={eventTypeFilter.getIsCheckedEventTypeLabel(eventType)}
                onChange={() => {
                  eventTypeFilter.toggleEventTypeLabel(eventType);
                }}
              />
            </ListItem>
          ))}
        </List>
      </ZUIDrawerModal>
    </Box>
  );
};

export default AllEventsList;
