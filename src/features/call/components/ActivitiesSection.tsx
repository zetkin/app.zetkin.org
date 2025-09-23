import { FC, useEffect, useState } from 'react';
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
import {
  CalendarMonthOutlined,
  Chair,
  Clear,
  GroupWork,
  Hotel,
} from '@mui/icons-material';
import { DateRangeCalendar, DateRangePickerDay } from '@mui/x-date-pickers-pro';

import EventCard from './EventCard';
import ZUISection from 'zui/components/ZUISection';
import { ZetkinCallTarget } from '../types';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import SurveyCard from './SurveyCard';
import useFilteredActivities, {
  Activity,
} from '../hooks/useFilteredActivities';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { filtersUpdated } from '../store';
import ZUIFilterButton from 'zui/components/ZUIFilterButton';
import ZUIText from 'zui/components/ZUIText';
import ZUIDrawerModal from 'zui/components/ZUIDrawerModal';
import { getContrastColor } from 'utils/colorUtils';
import notEmpty from 'utils/notEmpty';
import { ACTIVITIES } from 'features/campaigns/types';
import ZUIIcon from 'zui/components/ZUIIcon';
import ZUITabView from 'zui/components/ZUITabView';
import { MUIIcon } from 'zui/components/types';
import Survey from './Survey';

type Filter = {
  active: boolean;
  key: string;
  label: string | MUIIcon;
  onClick: () => void;
};

type ActivitiesProps = {
  activities: Activity[];
  baseFilters: Filter[];
  eventFilters: Filter[];
  isFiltered: boolean;
  onClearFilters: () => void;
  onSelectSurvey: (surveyId: number) => void;
  showNoActivities: boolean;
  showNoSignups: boolean;
  target: ZetkinCallTarget | null;
};

const Activities: FC<ActivitiesProps> = ({
  activities,
  baseFilters,
  eventFilters,
  isFiltered,
  onClearFilters,
  onSelectSurvey,
  showNoActivities,
  showNoSignups,
  target,
}) => {
  if (!target) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        gap: 1,
      }}
    >
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
            onClick={() => onClearFilters()}
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
        {eventFilters.map((filter) => (
          <ZUIFilterButton
            key={filter.key}
            active={filter.active}
            label={filter.label}
            onClick={filter.onClick}
          />
        ))}
      </Box>
      {showNoActivities && (
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <ZUIIcon color="secondary" icon={Chair} size="large" />
          <ZUIText color="secondary">No activities</ZUIText>
        </Box>
      )}
      {showNoSignups && (
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <ZUIIcon color="secondary" icon={Hotel} size="large" />
          <ZUIText color="secondary">{`${target.first_name} is not booked or signed up for any events.`}</ZUIText>
        </Box>
      )}
      {activities.map((activity) => {
        if (activity.kind == ACTIVITIES.EVENT) {
          return (
            <EventCard
              key={activity.data.id}
              event={activity.data}
              target={target}
            />
          );
        }

        if (activity.kind == ACTIVITIES.SURVEY) {
          return (
            <SurveyCard
              key={activity.data.id}
              onSelectSurvey={(surveyId) => onSelectSurvey(surveyId)}
              survey={activity.data}
            />
          );
        }
      })}
    </Box>
  );
};

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
  const { events, filteredActivities, filteredEvents, getDateRange, surveys } =
    useFilteredActivities(assignment.organization.id);
  const {
    filterState,
    customDatesToFilterEventsBy,
    eventDateFilterState,
    orgIdsToFilterEventsBy,
    projectIdsToFilterActivitiesBy,
  } = useAppSelector((state) => state.call.filters);
  const { respondedEventIds, submissionDataBySurveyId } = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex]
  );
  const respondedSurveyIds = Object.keys(submissionDataBySurveyId);

  const [drawerContent, setDrawerContent] = useState<
    'orgs' | 'calendar' | 'context' | null
  >(null);
  const [selectedTab, setSelectedTab] = useState<'activities' | 'survey'>(
    'activities'
  );
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
  const selectedSurvey =
    surveys.find((survey) => survey.id == selectedSurveyId) || null;

  useEffect(() => {
    if (selectedSurveyId) {
      setSelectedTab('activities');
      setTimeout(() => {
        setSelectedTab('survey');
      }, 600);
    } else {
      setSelectedTab('activities');
    }
  }, [selectedSurveyId]);

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

  const isFiltered =
    filterState.alreadyIn || filterState.events || filterState.surveys;
  const showAll =
    !filterState.alreadyIn && !filterState.events && !filterState.surveys;

  const orgs = [
    ...new Map(
      events.map((event) => event.organization).map((org) => [org['id'], org])
    ).values(),
  ].sort((a, b) => a.title.localeCompare(b.title));

  const surveysWithCampaign = surveys.filter((survey) => !!survey.campaign);
  const eventsWithCampaign = events.filter((event) => !!event.campaign);

  const activitiesWithCampaign = [
    ...surveysWithCampaign,
    ...eventsWithCampaign,
  ];

  const projects: { id: 'noProject' | number; title: string }[] = [
    ...new Map(
      eventsWithCampaign
        .map((event) => event.campaign)
        .filter(notEmpty)
        .map((campaign) => [campaign['title'], campaign])
    ).values(),
    ...new Map(
      surveysWithCampaign
        .map((survey) => survey.campaign)
        .filter(notEmpty)
        .map((campaign) => [campaign['title'], campaign])
    ).values(),
  ].sort((a, b) => a.title.localeCompare(b.title));

  if (activitiesWithCampaign.length != surveys.length + events.length) {
    projects.push({ id: 'noProject', title: 'noProject' });
  }

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

  const projectIdsWithEvents = events.reduce<(number | 'noProject')[]>(
    (projectIds, event) => {
      if (event.campaign && !projectIds.includes(event.campaign.id)) {
        projectIds = [...projectIds, event.campaign.id];
      } else if (!event.campaign && !projectIds.includes('noProject')) {
        projectIds = [...projectIds, 'noProject'];
      }
      return projectIds;
    },
    []
  );

  const projectIdsWithActivities = [
    ...projectIdsWithEvents,
    ...projectIdsWithSurveys,
  ];

  const moreThanOneOrgHasEvents = orgIdsWithEvents.length > 1;
  const moreThanOneProjectHasActivities = projectIdsWithActivities.length > 1;

  const showEventFilter =
    filterState.events ||
    (filterState.alreadyIn && filteredEvents.length > 0) ||
    showAll;
  const showSurveysFilter = filterState.surveys || showAll;
  const showAlreadyInFilter =
    filterState.alreadyIn || filterState.events || showAll;
  const showThisCallFilter =
    respondedEventIds.length > 0 || respondedSurveyIds.length > 0;

  const baseFilters = [
    ...(showThisCallFilter
      ? [
          {
            active: filterState.thisCall,
            key: 'thisCall',
            label: 'This call',
            onClick: () => {
              dispatch(
                filtersUpdated({
                  filterState: {
                    ...filterState,
                    thisCall: !filterState.thisCall,
                  },
                })
              );
            },
          },
        ]
      : []),
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
    ...(moreThanOneProjectHasActivities
      ? [
          {
            active: !!projectIdsToFilterActivitiesBy.length,
            key: 'context',
            label: projectIdsToFilterActivitiesBy.length
              ? `${projectIdsToFilterActivitiesBy.length} projects`
              : 'Context',
            onClick: () => {
              if (projectIdsToFilterActivitiesBy.length) {
                dispatch(
                  filtersUpdated({
                    projectIdsToFilterActivitiesBy: [],
                  })
                );
              } else {
                setDrawerContent('context');
              }
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

  return (
    <>
      {selectedSurvey && (
        <Box
          sx={(theme) => ({
            backgroundColor: theme.palette.common.white,
            minHeight: '100%',
          })}
        >
          <ZUITabView
            fullWidth
            items={[
              {
                label: 'Activities',
                render: () => (
                  <Activities
                    activities={filteredActivities}
                    baseFilters={baseFilters}
                    eventFilters={filterState.events ? eventFilters : []}
                    isFiltered={isFiltered}
                    onClearFilters={() =>
                      dispatch(
                        filtersUpdated({
                          customDatesToFilterEventsBy: [null, null],
                          eventDateFilterState: null,
                          filterState: {
                            alreadyIn: false,
                            events: false,
                            surveys: false,
                            thisCall: false,
                          },
                          orgIdsToFilterEventsBy: [],
                        })
                      )
                    }
                    onSelectSurvey={(surveyId) => setSelectedSurveyId(surveyId)}
                    showNoActivities={
                      filteredActivities.length == 0 && !filterState.alreadyIn
                    }
                    showNoSignups={
                      filteredActivities.length == 0 && filterState.alreadyIn
                    }
                    target={target}
                  />
                ),
                value: 'activities',
              },
              {
                label: selectedSurvey.title,
                render: () => {
                  return <Survey survey={selectedSurvey} />;
                },
                value: 'survey',
              },
            ]}
            onSelectTab={() =>
              setSelectedTab(
                selectedTab == 'activities' ? 'survey' : 'activities'
              )
            }
            selectedTab={selectedTab}
          />
        </Box>
      )}
      {!selectedSurveyId && (
        <ZUISection
          borders={false}
          fullHeight
          renderContent={() => (
            <Activities
              activities={filteredActivities}
              baseFilters={baseFilters}
              eventFilters={filterState.events ? eventFilters : []}
              isFiltered={isFiltered}
              onClearFilters={() =>
                dispatch(
                  filtersUpdated({
                    customDatesToFilterEventsBy: [null, null],
                    eventDateFilterState: null,
                    filterState: {
                      alreadyIn: false,
                      events: false,
                      surveys: false,
                      thisCall: false,
                    },
                    orgIdsToFilterEventsBy: [],
                  })
                )
              }
              onSelectSurvey={(surveyId) => setSelectedSurveyId(surveyId)}
              showNoActivities={
                filteredActivities.length == 0 && !filterState.alreadyIn
              }
              showNoSignups={
                filteredActivities.length == 0 && filterState.alreadyIn
              }
              target={target}
            />
          )}
          subtitle={`Acting as ${target?.first_name}`}
          title="Activities"
        />
      )}
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
        open={drawerContent == 'context'}
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
                checked={projectIdsToFilterActivitiesBy.includes(project.id)}
                onChange={(_event, checked) => {
                  if (checked) {
                    dispatch(
                      filtersUpdated({
                        projectIdsToFilterActivitiesBy: [
                          ...projectIdsToFilterActivitiesBy,
                          project.id,
                        ],
                      })
                    );
                  } else {
                    dispatch(
                      filtersUpdated({
                        projectIdsToFilterActivitiesBy:
                          projectIdsToFilterActivitiesBy.filter(
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
