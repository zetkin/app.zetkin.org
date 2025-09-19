import { FC, useState } from 'react';
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Switch,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useIntl } from 'react-intl';
import { CalendarMonthOutlined, Clear } from '@mui/icons-material';
import { DateRangeCalendar, DateRangePickerDay } from '@mui/x-date-pickers-pro';

import EventCard from './EventCard';
import useSurveysWithElements from 'features/surveys/hooks/useSurveysWithElements';
import ZUISection from 'zui/components/ZUISection';
import { ZetkinCallTarget } from '../types';
import { ZetkinCallAssignment, ZetkinEvent } from 'utils/types/zetkin';
import SurveyCard from './SurveyCard';
import useFilteredActivities from '../hooks/useFilteredActivities';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { filtersUpdated } from '../store';
import ZUIFilterButton from 'zui/components/ZUIFilterButton';
import ZUIText from 'zui/components/ZUIText';
import ZUIDrawerModal from 'zui/components/ZUIDrawerModal';
import { getContrastColor } from 'utils/colorUtils';

type ActivitiesSectionProps = {
  assignment: ZetkinCallAssignment;
  target: ZetkinCallTarget | null;
};

const ActivitiesSection: FC<ActivitiesSectionProps> = ({
  assignment,
  target,
}) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { events, filteredEvents, getDateRange } = useFilteredActivities(
    assignment.organization.id
  );
  const surveys = useSurveysWithElements(assignment.organization.id).data || [];
  const {
    filterState,
    customDatesToFilterEventsBy,
    eventDateFilterState,
    orgIdsToFilterEventsBy,
  } = useAppSelector((state) => state.call.filters);
  const today = new Date();
  const isFiltered = filterState.events || filterState.surveys;
  const showAll = !filterState.events && !filterState.surveys;

  const [drawerContent, setDrawerContent] = useState<
    'orgs' | 'calendar' | null
  >(null);

  const orgs = [
    ...new Map(
      events.map((event) => event.organization).map((org) => [org['id'], org])
    ).values(),
  ].sort((a, b) => a.title.localeCompare(b.title));

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

  const orgIdsWithEvents = events.reduce<number[]>((orgIds, event) => {
    if (!orgIds.includes(event.organization.id)) {
      orgIds = [...orgIds, event.organization.id];
    }
    return orgIds;
  }, []);

  const moreThanOneOrgHasEvents = orgIdsWithEvents.length > 1;

  const showEventFilter = filterState.events || showAll;
  const showSurveysFilter = filterState.surveys || showAll;

  const baseFilters = [
    ...(showEventFilter
      ? [
          {
            active: filterState.events,
            key: 'events',
            label: 'Events',
            onClick: () => {
              dispatch(
                filtersUpdated({
                  filterState: { ...filterState, events: !filterState.events },
                })
              );
            },
          },
        ]
      : []),
    ...(showSurveysFilter
      ? [
          {
            active: filterState.surveys,
            key: 'surveys',
            label: 'Surveys',
            onClick: () => {
              dispatch(
                filtersUpdated({
                  filterState: {
                    ...filterState,
                    surveys: !filterState.surveys,
                  },
                })
              );
            },
          },
        ]
      : []),
  ];

  const eventDateFilters = [
    {
      active: eventDateFilterState == 'today',
      key: 'today',
      label: 'Today',
      onClick: () => {
        dispatch(
          filtersUpdated({
            customDatesToFilterEventsBy: [null, null],
            eventDateFilterState:
              eventDateFilterState == 'today' ? null : 'today',
          })
        );
      },
    },
    {
      active: eventDateFilterState == 'tomorrow',
      key: 'tomorrow',
      label: 'Tomorrow',
      onClick: () => {
        dispatch(
          filtersUpdated({
            customDatesToFilterEventsBy: [null, null],
            eventDateFilterState:
              eventDateFilterState == 'tomorrow' ? null : 'tomorrow',
          })
        );
      },
    },
    {
      active: eventDateFilterState == 'thisWeek',
      key: 'thisWeek',
      label: 'This week',
      onClick: () => {
        dispatch(
          filtersUpdated({
            customDatesToFilterEventsBy: [null, null],
            eventDateFilterState:
              eventDateFilterState == 'thisWeek' ? null : 'thisWeek',
          })
        );
      },
    },
    {
      active: eventDateFilterState == 'custom',
      key: 'custom',
      label:
        eventDateFilterState == 'custom' && customDatesToFilterEventsBy[0]
          ? getDatesFilteredBy(
              customDatesToFilterEventsBy[1],
              customDatesToFilterEventsBy[0]
            )
          : CalendarMonthOutlined,
      onClick: () => {
        if (eventDateFilterState == 'custom') {
          dispatch(
            filtersUpdated({
              customDatesToFilterEventsBy: [null, null],
              eventDateFilterState: null,
            })
          );
        } else {
          setDrawerContent('calendar');
        }
      },
    },
    ...(moreThanOneOrgHasEvents
      ? [
          {
            active: !!orgIdsToFilterEventsBy.length,
            key: 'orgs',
            label: `${orgIdsToFilterEventsBy.length} orgs`,
            onClick: () => {
              if (orgIdsToFilterEventsBy.length) {
                dispatch(
                  filtersUpdated({
                    orgIdsToFilterEventsBy: [],
                  })
                );
              }
              setDrawerContent('orgs');
            },
          },
        ]
      : []),
  ];

  const eventsByDate = filteredEvents.reduce<Record<string, ZetkinEvent[]>>(
    (dates, event) => {
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
    },
    {}
  );

  const dates = Object.keys(eventsByDate).sort();

  const activeSurveys = surveys.filter(
    ({ published, expires }) =>
      published && (!expires || new Date(expires) >= today)
  );

  return (
    <>
      <ZUISection
        borders={false}
        fullHeight
        renderContent={() => {
          if (!target) {
            return <Box sx={{ height: '200px' }} />;
          }
          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {events.length != 0 && (
                <Box
                  alignItems="center"
                  display="flex"
                  flexWrap="wrap"
                  gap={1}
                  maxWidth="100%"
                >
                  {isFiltered && (
                    <ZUIFilterButton
                      active={true}
                      circular
                      label={Clear}
                      onClick={() =>
                        dispatch(
                          filtersUpdated({
                            customDatesToFilterEventsBy: [null, null],
                            eventDateFilterState: null,
                            filterState: {
                              events: false,
                              surveys: false,
                            },
                            orgIdsToFilterEventsBy: [],
                          })
                        )
                      }
                    />
                  )}
                  {baseFilters.map((filter) => (
                    <ZUIFilterButton
                      key={filter.key}
                      active={filter.active}
                      label={filter.label}
                      onClick={filter.onClick}
                    />
                  ))}
                  {filterState.events &&
                    eventDateFilters.map((filter) => (
                      <ZUIFilterButton
                        key={filter.key}
                        active={filter.active}
                        label={filter.label}
                        onClick={filter.onClick}
                      />
                    ))}
                </Box>
              )}
              {(showAll || filterState.events) &&
                dates.map((date, index) => {
                  return index > 0 ? null : (
                    <Box
                      key={date}
                      display="flex"
                      flexDirection="column"
                      gap={1}
                    >
                      {eventsByDate[date].map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          target={target}
                        />
                      ))}
                    </Box>
                  );
                })}
              {(showAll || filterState.surveys) &&
                activeSurveys.map((survey, index) => {
                  return index > 0 ? null : (
                    <SurveyCard key={index} survey={survey} />
                  );
                })}
            </Box>
          );
        }}
        subtitle={`Acting as ${target?.first_name}`}
        title="Activities"
      />
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
            onChange={(newDateRange) =>
              dispatch(
                filtersUpdated({
                  customDatesToFilterEventsBy: newDateRange,
                  eventDateFilterState: 'custom',
                })
              )
            }
            slots={{
              day: (props) => {
                const day = props.day;

                const hasEvents = !!events.find((event) => {
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
                checked={orgIdsToFilterEventsBy.includes(org.id)}
                onChange={(_event, checked) => {
                  if (checked) {
                    dispatch(
                      filtersUpdated({
                        orgIdsToFilterEventsBy: [
                          ...orgIdsToFilterEventsBy,
                          org.id,
                        ],
                      })
                    );
                  } else {
                    dispatch(
                      filtersUpdated({
                        orgIdsToFilterEventsBy: orgIdsToFilterEventsBy.filter(
                          (id) => id != org.id
                        ),
                      })
                    );
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </ZUIDrawerModal>
    </>
  );
};

export default ActivitiesSection;
