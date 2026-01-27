'use client';

import dayjs, { Dayjs } from 'dayjs';
import { Box, Fade, List, ListItem, Switch } from '@mui/material';
import { FC, useState } from 'react';
import { DateRangeCalendar, DateRangePickerDay } from '@mui/x-date-pickers-pro';
import { useIntl } from 'react-intl';
import { Clear, CalendarMonthOutlined, Search } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

import EventListItem from 'features/home/components/EventListItem';
import { ZetkinEventWithStatus } from 'features/home/types';
import useIncrementalDelay from 'features/home/hooks/useIncrementalDelay';
import ZUIDate from 'zui/ZUIDate';
import { ZetkinEvent } from 'utils/types/zetkin';
import useUser from 'core/hooks/useUser';
import { Msg, useMessages } from 'core/i18n';
import ZUIText from 'zui/components/ZUIText';
import ZUIFilterButton from 'zui/components/ZUIFilterButton';
import ZUIButton from '../../../zui/components/ZUIButton';
import ZUIDrawerModal from '../../../zui/components/ZUIDrawerModal';
import { getContrastColor } from '../../../utils/colorUtils';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import useFilteredCampaignEvents from '../hooks/useFilteredCampaignEvents';
import NoEventsBlurb from 'features/organizations/components/NoEventsBlurb';
import { filtersUpdated } from '../store';
import messageIds from '../l10n/messageIds';
import useCampaign from '../hooks/useCampaign';
import SignupChoiceModal from 'features/organizations/components/SignupChoiceModal';
import useFeatureWithOrg from 'utils/featureFlags/useFeatureWithOrg';
import { UNAUTH_EVENT_SIGNUP } from 'utils/featureFlags';

type Props = {
  campId: number;
  orgId: number;
};

const PublicProjectPage: FC<Props> = ({ campId, orgId }) => {
  const intl = useIntl();
  const router = useRouter();
  const messages = useMessages(messageIds);
  const nextDelay = useIncrementalDelay();
  const user = useUser();
  const dispatch = useAppDispatch();
  const campaign = useCampaign(orgId, campId).campaignFuture.data;
  const hasUnauthSignup = useFeatureWithOrg(UNAUTH_EVENT_SIGNUP, orgId);

  const {
    allEvents,
    eventTypeFilter,
    filteredEvents,
    getDateRange,
    locationEvents,
  } = useFilteredCampaignEvents(orgId, campId);
  const { customDatesToFilterBy, dateFilterState, geojsonToFilterBy } =
    useAppSelector((state) => state.campaigns.filters);

  const [postAuthEvent, setPostAuthEvent] = useState<ZetkinEvent | null>(null);
  const [drawerContent, setDrawerContent] = useState<
    'calendar' | 'eventTypes' | null
  >(null);

  const isFiltered =
    !!dateFilterState ||
    eventTypeFilter.isFiltered ||
    !!geojsonToFilterBy.length;

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

  let locationFilterLabel = '';
  if (geojsonToFilterBy.length > 1) {
    locationFilterLabel =
      messages.publicProjectPage.eventList.filterButtonLabels.locations({
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
      label: messages.publicProjectPage.eventList.filterButtonLabels.today(),
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
      label: messages.publicProjectPage.eventList.filterButtonLabels.tomorrow(),
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
      label: messages.publicProjectPage.eventList.filterButtonLabels.thisWeek(),
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
              campaign
                ? messages.publicProjectPage.eventList.noEventsBlurb.description(
                    { project: campaign.title }
                  )
                : undefined
            }
            title={messages.publicProjectPage.eventList.noEventsBlurb.headline()}
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
          sx={{ overflowX: 'auto' }}
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
            <Msg
              id={messageIds.publicProjectPage.eventList.emptyList.message}
            />
          </ZUIText>
          <Search color="secondary" fontSize="large" />
          {isFiltered && (
            <ZUIButton
              label={messages.publicProjectPage.eventList.emptyList.removeFiltersButton()}
              onClick={() => {
                dispatch(
                  filtersUpdated({
                    customDatesToFilterBy: [null, null],
                    dateFilterState: null,
                  })
                );
                eventTypeFilter.clearEventTypeFilter();
              }}
              variant="secondary"
            />
          )}
        </Box>
      )}
      {dates.map((date) => (
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

export default PublicProjectPage;
