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
import { CalendarMonthOutlined, Clear, GroupWork } from '@mui/icons-material';
import { DateRangeCalendar, DateRangePickerDay } from '@mui/x-date-pickers-pro';

import EventCard from './EventCard';
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
import notEmpty from 'utils/notEmpty';

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
  const { events, filteredEvents, filteredSurveys, getDateRange, surveys } =
    useFilteredActivities(assignment.organization.id);
  const {
    filterState,
    customDatesToFilterEventsBy,
    eventDateFilterState,
    orgIdsToFilterEventsBy,
    projectIdsToFilterSurveysBy,
  } = useAppSelector((state) => state.call.filters);
  const idsOfEventsRespondedTo = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex].respondedEventIds
  );
  const isFiltered =
    filterState.alreadyIn || filterState.events || filterState.surveys;
  const showAll =
    !filterState.alreadyIn && !filterState.events && !filterState.surveys;

  const [drawerContent, setDrawerContent] = useState<
    'orgs' | 'calendar' | 'projects' | null
  >(null);

  const orgs = [
    ...new Map(
      events.map((event) => event.organization).map((org) => [org['id'], org])
    ).values(),
  ].sort((a, b) => a.title.localeCompare(b.title));

  const surveysWithCampaign = surveys.filter((survey) => !!survey.campaign);

  const projects: { id: 'noProject' | number; title: string }[] = [
    ...new Map(
      surveysWithCampaign
        .map((survey) => survey.campaign)
        .filter(notEmpty)
        .map((campaign) => [campaign['title'], campaign])
    ).values(),
  ].sort((a, b) => a.title.localeCompare(b.title));

  if (surveysWithCampaign.length != surveys.length) {
    projects.push({ id: 'noProject', title: 'noProject' });
  }

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

  const eventsByDate = filteredEvents
    .filter((event) => {
      if (!filterState.alreadyIn) {
        return true;
      }

      if (!target) {
        return false;
      }
      const isBooked = target.future_actions.some(
        (futureEvent) => futureEvent.id == event.id
      );

      const isSignedUp = idsOfEventsRespondedTo.includes(event.id);

      return isSignedUp || isBooked;
    })
    .reduce<Record<string, ZetkinEvent[]>>((dates, event) => {
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

  const orgIdsWithEvents = events.reduce<number[]>((orgIds, event) => {
    if (!orgIds.includes(event.organization.id)) {
      orgIds = [...orgIds, event.organization.id];
    }
    return orgIds;
  }, []);

  const projectIdsWithSurveys = surveys.reduce<(number | 'noProject')[]>(
    (projectIds, survey) => {
      if (survey.campaign && !projectIds.includes(survey.campaign.id)) {
        projectIds = [...projectIds, survey.campaign.id];
      } else if (!survey.campaign && !projectIds.includes('noProject')) {
        projectIds = [...projectIds, 'noProject'];
      }
      return projectIds;
    },
    []
  );

  const moreThanOneOrgHasEvents = orgIdsWithEvents.length > 1;
  const moreThanOneProjectHasSurveys = projectIdsWithSurveys.length > 1;

  const showEventFilter =
    filterState.events ||
    (filterState.alreadyIn && dates.length > 0) ||
    showAll;
  const showSurveysFilter = filterState.surveys || showAll;
  const showAlreadyInFilter =
    filterState.alreadyIn || filterState.events || showAll;

  const baseFilters = [
    ...(showAlreadyInFilter
      ? [
          {
            active: filterState.alreadyIn,
            key: 'alreadyIn',
            label: 'Already in',
            onClick: () => {
              dispatch(
                filtersUpdated({
                  filterState: {
                    ...filterState,
                    alreadyIn: !filterState.alreadyIn,
                  },
                })
              );
            },
          },
        ]
      : []),
    ...(showEventFilter
      ? [
          {
            active: filterState.events || filterState.alreadyIn,
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

  const eventFilters = [
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
              } else {
                setDrawerContent('orgs');
              }
            },
          },
        ]
      : []),
  ];

  const surveyFilters = [
    ...(moreThanOneProjectHasSurveys
      ? [
          {
            active: !!projectIdsToFilterSurveysBy.length,
            key: 'projects',
            label: projectIdsToFilterSurveysBy.length
              ? `${projectIdsToFilterSurveysBy.length} projects`
              : 'Projects',
            onClick: () => {
              if (projectIdsToFilterSurveysBy.length) {
                dispatch(
                  filtersUpdated({
                    projectIdsToFilterSurveysBy: [],
                  })
                );
              } else {
                setDrawerContent('projects');
              }
            },
          },
        ]
      : []),
  ];

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
                              alreadyIn: false,
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
                    eventFilters.map((filter) => (
                      <ZUIFilterButton
                        key={filter.key}
                        active={filter.active}
                        label={filter.label}
                        onClick={filter.onClick}
                      />
                    ))}
                  {filterState.surveys &&
                    surveyFilters.map((filter) => (
                      <ZUIFilterButton
                        key={filter.key}
                        active={filter.active}
                        label={filter.label}
                        onClick={filter.onClick}
                      />
                    ))}
                </Box>
              )}
              {(showAll || filterState.events || filterState.alreadyIn) &&
                dates.map((date) => (
                  <Box key={date} display="flex" flexDirection="column" gap={1}>
                    {eventsByDate[date].map((event) => (
                      <EventCard key={event.id} event={event} target={target} />
                    ))}
                  </Box>
                ))}
              {(showAll || filterState.surveys) &&
                filteredSurveys.map((survey, index) => (
                  <SurveyCard key={index} survey={survey} />
                ))}
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
      <ZUIDrawerModal
        onClose={() => setDrawerContent(null)}
        open={drawerContent == 'projects'}
      >
        <List>
          {projects.map((project) => (
            <ListItem key={project.id} sx={{ justifyContent: 'space-between' }}>
              <Box alignItems="center" display="flex">
                <ListItemAvatar>
                  <GroupWork />
                </ListItemAvatar>
                <ZUIText>
                  {project.id == 'noProject' ? 'No project' : project.title}
                </ZUIText>
              </Box>
              <Switch
                checked={projectIdsToFilterSurveysBy.includes(project.id)}
                onChange={(_event, checked) => {
                  if (checked) {
                    dispatch(
                      filtersUpdated({
                        projectIdsToFilterSurveysBy: [
                          ...projectIdsToFilterSurveysBy,
                          project.id,
                        ],
                      })
                    );
                  } else {
                    dispatch(
                      filtersUpdated({
                        projectIdsToFilterSurveysBy:
                          projectIdsToFilterSurveysBy.filter(
                            (id) => id != project.id
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
