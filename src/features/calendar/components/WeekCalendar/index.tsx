import { FormattedDate } from 'react-intl';
import { grey } from '@mui/material/colors';
import NextLink from 'next/link';
import { Box, Link, List, Tooltip, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { CALENDAR_RANGES, getViewRange } from '../utils';
import { useEffect, useRef } from 'react';

import WeekCalendarEvent from './WeekCalendarEvent';
import WeekCalendarTask from './WeekCalendarTask';
import { ZetkinCampaign, ZetkinEvent, ZetkinTask } from 'utils/types/zetkin';

interface WeekCalendarProps {
  baseHref: string;
  campaigns: ZetkinCampaign[];
  events: ZetkinEvent[];
  focusDate: Date;
  orgId: string;
  tasks: ZetkinTask[];
}
const ONE_HOUR = 100 / 24;

const useStyles = makeStyles(() => ({
  list: {
    // show lighter background color from 8am to 10pm
    background: `linear-gradient(${grey[300]} ${ONE_HOUR * 8}%, ${grey[200]} ${
      ONE_HOUR * 8
    }%, ${grey[200]} ${ONE_HOUR * 22}%, ${grey[300]} ${ONE_HOUR * 22}%)`,
    height: '100%',
    margin: 0,
    padding: 0,
    position: 'relative',
    width: '100%',
  },
  pastDays: {
    color: '#bbb',
  },
  today: {
    background: 'blue',
    borderRadius: '50%',
    color: 'white',
    display: 'flex',
    height: 'max-content',
    justifyContent: 'center',
    minWidth: '24px',
    width: 'max-content',
  },
}));

const WeekCalendar = ({
  orgId,
  baseHref,
  campaigns,
  events,
  focusDate,
  tasks,
}: WeekCalendarProps): JSX.Element => {
  const classes = useStyles();
  const calendar = useRef<HTMLDivElement>(null);
  const calendarWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const height = calendar.current?.clientHeight || 0;
    const y = (height / 24) * 8; // approx 8am
    calendarWrapper.current?.scrollTo(0, y);
  }, []);

  const { firstDayInView, lastDayInView } = getViewRange(
    focusDate,
    CALENDAR_RANGES.WEEK
  );

  const eventsOfTheWeek = events.filter((event) => {
    return (
      (new Date(event.start_time) >= firstDayInView &&
        new Date(event.start_time) < lastDayInView) ||
      (new Date(event.end_time) > firstDayInView &&
        new Date(event.end_time) <= lastDayInView)
    );
  });

  const tasksOfTheWeek = tasks.filter((task) => {
    return (
      new Date(task.deadline as string) >= firstDayInView &&
      new Date(task.deadline as string) < lastDayInView
    );
  });

  const getEventsOnThisDate = (date: number) => {
    return eventsOfTheWeek.filter((event) => {
      return (
        new Date(event.start_time).getUTCDate() === date ||
        new Date(event.end_time).getUTCDate() === date
      );
    });
  };

  const getTasksOnThisDate = (start: Date, end: Date) => {
    return tasksOfTheWeek.filter((task) =>
      isInRange(new Date(task.deadline as string), start, end)
    );
  };

  const isInRange = (date: Date, start: Date, end: Date) => {
    return date > start && date <= end;
  };

  const today = new Date();

  return (
    <Box display="flex" flexDirection="column" height={1}>
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={0}
        justifyContent="space-between"
      >
        <Box display="flex">
          {Array.from(Array(7).keys()).map((_, index) => {
            const currentDate = new Date(
              new Date(firstDayInView).setDate(firstDayInView.getDate() + index)
            );
            const nextDate = new Date(
              new Date(currentDate).setDate(currentDate.getDate() + 1)
            );
            const isToday = isInRange(today, currentDate, nextDate);
            const isPast = currentDate < today && !isToday;
            return (
              <Box
                key={index}
                alignItems="center"
                className={isPast ? classes.pastDays : ''}
                data-testid="weekdays"
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                width="100%"
              >
                <Typography
                  component="h2"
                  data-testid={`weekday-${index}`}
                  variant="subtitle2"
                >
                  <FormattedDate value={currentDate} weekday="short" />
                </Typography>
                <Typography
                  className={isToday ? classes.today : ''}
                  data-testid={`date-${index}`}
                >
                  <FormattedDate day="2-digit" value={currentDate} />
                </Typography>
              </Box>
            );
          })}
        </Box>
        <Box display="flex" flexDirection="column" mb={0.5}>
          {campaigns.map((c) => {
            const campaignEvents = events
              .filter((e) => e.campaign.id === c.id)
              .sort((a, b) => {
                return (
                  new Date(a.start_time).getTime() -
                  new Date(b.start_time).getTime()
                );
              });
            return campaignEvents.length ? (
              <CalendarBar
                key={c.id}
                campaign={c}
                events={campaignEvents}
                firstCalendarDay={firstDayInView}
                orgId={orgId}
              />
            ) : null;
          })}
        </Box>
      </Box>
      <Box display="flex" justifyItems="space-between" pr={1.5}>
        {Array.from(Array(7).keys()).map((_, index) => {
          const startOfDay = new Date(
            new Date(
              new Date(firstDayInView).setUTCDate(
                firstDayInView.getDate() + index
              )
            ).setUTCHours(0, 0, 0, 0)
          );
          const endOfDay = new Date(
            new Date(startOfDay).setDate(startOfDay.getDate() + 1)
          );
          return (
            <Box
              key={index}
              bgcolor={grey[200]}
              flexBasis={`${100 / 7}%`}
              flexGrow={0}
              flexShrink={1}
              mb={0.5}
              overflow="hidden"
            >
              <List disablePadding>
                {getTasksOnThisDate(startOfDay, endOfDay).map((task) => {
                  const campaign = campaigns.find(
                    (c) => c.id === task.campaign.id
                  );
                  return (
                    <WeekCalendarTask
                      key={task.id}
                      baseHref={baseHref}
                      campaign={campaign}
                      task={task}
                    />
                  );
                })}
              </List>
            </Box>
          );
        })}
      </Box>
      <Box
        data-testid="calendar-wrapper"
        {...{ ref: calendarWrapper }}
        alignItems="center"
        flexGrow={1}
        overflow="auto"
      >
        <Box
          {...{ ref: calendar }}
          display="flex"
          height="100rem"
          justifyContent="start"
        >
          {Array.from(Array(7).keys()).map((_, index) => {
            const startOfDay = new Date(
              new Date(
                new Date(firstDayInView).setUTCDate(
                  firstDayInView.getDate() + index
                )
              ).setUTCHours(0, 0, 0, 0)
            );
            return (
              <Box
                key={index}
                display="flex"
                flexDirection="column"
                height={1}
                justifyContent="space-between"
                mx={0.5}
                width={1}
              >
                <List
                  className={classes.list}
                  data-testid={`day-${index}-events`}
                >
                  {getEventsOnThisDate(startOfDay.getUTCDate())
                    ?.reduce(
                      (
                        acc: [number, ZetkinEvent][],
                        event: ZetkinEvent,
                        index,
                        array
                      ) => {
                        const prevEvents = array.slice(0, index);
                        const reversedPrevEvents = prevEvents.reverse();
                        let shiftValue;
                        const lastOverlappingEvent = reversedPrevEvents.find(
                          (prev) =>
                            new Date(event.start_time) < new Date(prev.end_time)
                        );
                        if (!lastOverlappingEvent) {
                          shiftValue = 0;
                        } else {
                          const overlapIndex = acc.findIndex(
                            (e) => e[1].id === lastOverlappingEvent.id
                          );
                          shiftValue = lastOverlappingEvent
                            ? acc[overlapIndex][0] + 1
                            : 0;
                        }
                        return [...acc, [shiftValue, event]] as [
                          number,
                          ZetkinEvent
                        ][];
                      },
                      []
                    )
                    .map((eventWithShiftValue) => {
                      const [shiftValue, event] = eventWithShiftValue;
                      const campaign = campaigns.find(
                        (c) => c.id === event.campaign.id
                      );
                      return (
                        <WeekCalendarEvent
                          key={event.id}
                          baseHref={baseHref}
                          campaign={campaign}
                          event={event}
                          shiftValue={shiftValue}
                          startOfDay={startOfDay}
                        />
                      );
                    })}
                </List>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default WeekCalendar;

interface CalendarBarProps {
  orgId: string;
  campaign: ZetkinCampaign;
  events: ZetkinEvent[];
  firstCalendarDay: Date;
}

const CalendarBar = ({
  orgId,
  campaign,
  events,
  firstCalendarDay,
}: CalendarBarProps): JSX.Element | null => {
  const { id, color, title } = campaign;

  const lastCalendarDay = new Date(
    new Date(firstCalendarDay).setDate(firstCalendarDay.getDate() + 7)
  );

  const barUnit = 100 / 7;

  const firstEventDate = new Date(events[0].start_time);
  const lastEventDate = new Date(events[events.length - 1].end_time);

  if (firstEventDate > lastCalendarDay || lastEventDate < firstCalendarDay) {
    return null;
  }

  let left, right;
  if (firstEventDate < firstCalendarDay) {
    left = 0;
  } else {
    left = ((new Date(firstEventDate).getDay() || 7) - 1) * barUnit;
  }
  if (lastEventDate > lastCalendarDay) {
    right = 100;
  } else {
    right = ((new Date(lastEventDate).getDay() || 7) - 1) * barUnit + barUnit;
  }
  if (right > 100) {
    right = 100;
  }

  const width = right - left;

  return (
    <Box height="0.5rem" position="relative" width={1}>
      <NextLink href={`/organize/${orgId}/campaigns/${id}`} passHref>
        <Link underline="hover">
          <Tooltip
            arrow
            data-testid={`calendar-bar-popover-${id}`}
            title={title}
          >
            <Box
              bgcolor={color}
              data-testid={`calendar-bar-${id}`}
              height={1}
              left={`${left}%`}
              position="absolute"
              width={`${width}%`}
            />
          </Tooltip>
        </Link>
      </NextLink>
    </Box>
  );
};
