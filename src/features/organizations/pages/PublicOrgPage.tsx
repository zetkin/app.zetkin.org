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
import { FC, useState } from 'react';
import { DateRangeCalendar, DateRangePickerDay } from '@mui/x-date-pickers-pro';
import { useIntl } from 'react-intl';
import { Clear, CalendarMonthOutlined, Search } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

import EventListItem from 'features/home/components/EventListItem';
import { ZetkinEventWithStatus } from 'features/home/types';
import useIncrementalDelay from 'features/home/hooks/useIncrementalDelay';
import ZUIDate from 'zui/ZUIDate';
import SubOrgEventBlurb from '../components/SubOrgEventBlurb';
import { ZetkinEvent } from 'utils/types/zetkin';
import useUser from 'core/hooks/useUser';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import NoEventsBlurb from '../components/NoEventsBlurb';
import ZUIText from 'zui/components/ZUIText';
import ZUIDivider from 'zui/components/ZUIDivider';
import ZUIFilterButton from 'zui/components/ZUIFilterButton';
import ZUIButton from '../../../zui/components/ZUIButton';
import ZUIDrawerModal from '../../../zui/components/ZUIDrawerModal';
import { getContrastColor } from '../../../utils/colorUtils';
import useFilteredOrgEvents from '../hooks/useFilteredOrgEvents';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { filtersUpdated } from '../store';
import useOrganization from '../hooks/useOrganization';
import useIsMobile from 'utils/hooks/useIsMobile';
import SignupChoiceModal from '../components/SignupChoiceModal';
import { UNAUTH_EVENT_SIGNUP } from 'utils/featureFlags';
import useFeatureWithOrg from 'utils/featureFlags/useFeatureWithOrg';

type Props = {
  orgId: number;
};

const PublicOrgPage: FC<Props> = ({ orgId }) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const intl = useIntl();
  const messages = useMessages(messageIds);
  const nextDelay = useIncrementalDelay();
  const organization = useOrganization(orgId).data;
  const user = useUser();
  const dispatch = useAppDispatch();
  const { allEvents, getDateRange, locationEvents, eventTypeFilter } =
    useFilteredOrgEvents(orgId);
  const {
    customDatesToFilterBy,
    dateFilterState,
    geojsonToFilterBy,
    orgIdsToFilterBy,
  } = useAppSelector((state) => state.organizations.filters);

  const hasUnauthSignup = useFeatureWithOrg(UNAUTH_EVENT_SIGNUP, orgId);
  const [postAuthEvent, setPostAuthEvent] = useState<ZetkinEvent | null>(null);
  const [includeSubOrgs, setIncludeSubOrgs] = useState(false);
  const [drawerContent, setDrawerContent] = useState<
    'orgs' | 'calendar' | 'eventTypes' | null
  >(null);

  const orgs = [
    ...new Map(
      allEvents
        .map((event) => event.organization)
        .map((org) => [org['id'], org])
    ).values(),
  ].sort((a, b) => a.title.localeCompare(b.title));

  const isFiltered =
    !!dateFilterState ||
    eventTypeFilter.isFiltered ||
    !!geojsonToFilterBy.length ||
    !!orgIdsToFilterBy.length;

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

  let locationFilterLabel = '';
  if (geojsonToFilterBy.length > 1) {
    locationFilterLabel = messages.allEventsList.filterButtonLabels.locations({
      count: geojsonToFilterBy.length,
    });
  } else if (geojsonToFilterBy.length === 1) {
    locationFilterLabel = geojsonToFilterBy[0]?.properties?.location
      ?.title as string;
  }

  const filters = [
    {
      active: dateFilterState == 'today',
      key: 'today',
      label: messages.allEventsList.filterButtonLabels.today(),
      onClick: () => {
        dispatch(
          filtersUpdated({
            customDatesToFilterBy: [null, null],
            dateFilterState: 'today',
          })
        );
      },
    },
    {
      active: dateFilterState == 'tomorrow',
      key: 'tomorrow',
      label: messages.allEventsList.filterButtonLabels.tomorrow(),
      onClick: () => {
        dispatch(
          filtersUpdated({
            customDatesToFilterBy: [null, null],
            dateFilterState: 'tomorrow',
          })
        );
      },
    },
    {
      active: dateFilterState == 'thisWeek',
      key: 'thisWeek',
      label: messages.allEventsList.filterButtonLabels.thisWeek(),
      onClick: () => {
        dispatch(
          filtersUpdated({
            customDatesToFilterBy: [null, null],
            dateFilterState: 'thisWeek',
          })
        );
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
  ]
    .concat(
      geojsonToFilterBy.length
        ? [
            {
              active: true,
              key: 'location',
              label: locationFilterLabel,
              onClick: () => {
                dispatch(
                  filtersUpdated({
                    geojsonToFilterBy: [],
                  })
                );
              },
            },
          ]
        : []
    )
    .sort((a, b) => {
      if (a.active && !b.active) {
        return -1;
      } else if (!a.active && b.active) {
        return 1;
      } else {
        return 0;
      }
    });

  const topOrgEvents = allEvents.filter(
    (event) => event.organization.id == orgId
  );

  const events =
    includeSubOrgs || topOrgEvents.length == 0 ? allEvents : topOrgEvents;

  const eventsByDate = locationEvents.reduce<
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
    orgIdsToFilterBy.length == 0 && locationEvents.length > events.length;

  const showNoEventsBlurb = !allEvents.length;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        gap: 1,
        height: '100%',
        my: 2,
      }}
    >
      {showNoEventsBlurb && (
        <Box key="empty">
          <NoEventsBlurb
            description={
              organization
                ? messages.noEventsBlurb.description({
                    org: organization.title,
                  })
                : undefined
            }
            title={messages.noEventsBlurb.headline()}
          />
        </Box>
      )}
      {allEvents.length != 0 && (
        <Box
          alignItems="center"
          display="flex"
          gap={1}
          maxWidth="100%"
          padding={1}
          sx={{
            ...(isMobile ? { overflowX: 'auto' } : { flexWrap: 'wrap' }),
          }}
        >
          {isFiltered && (
            <ZUIFilterButton
              active={true}
              circular
              label={Clear}
              onClick={() => {
                dispatch(
                  filtersUpdated({
                    customDatesToFilterBy: [null, null],
                    dateFilterState: null,
                    geojsonToFilterBy: [],
                    orgIdsToFilterBy: [],
                  })
                );
                eventTypeFilter.clearEventTypeFilter();
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
      {locationEvents.length == 0 && (
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
                dispatch(
                  filtersUpdated({
                    customDatesToFilterBy: [null, null],
                    dateFilterState: null,
                    orgIdsToFilterBy: [],
                  })
                );
                eventTypeFilter.clearEventTypeFilter();
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
                  href={`/o/${event.organization.id}/events/${event.id}`}
                  onClickSignUp={(ev) => {
                    if (!user) {
                      if (hasUnauthSignup) {
                        setPostAuthEvent(event);
                        ev.preventDefault();
                      } else {
                        router.push(
                          `/o/${event.organization.id}/events/${event.id}`
                        );
                      }
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
            onChange={(newDateRange) =>
              dispatch(
                filtersUpdated({
                  customDatesToFilterBy: newDateRange,
                  dateFilterState: 'custom',
                })
              )
            }
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
                    dispatch(
                      filtersUpdated({
                        orgIdsToFilterBy: [...orgIdsToFilterBy, org.id],
                      })
                    );
                  } else {
                    dispatch(
                      filtersUpdated({
                        orgIdsToFilterBy: orgIdsToFilterBy.filter(
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
      {postAuthEvent && (
        <SignupChoiceModal
          eventId={postAuthEvent.id}
          onClose={() => setPostAuthEvent(null)}
          orgId={postAuthEvent.organization.id}
        />
      )}
    </Box>
  );
};

export default PublicOrgPage;
