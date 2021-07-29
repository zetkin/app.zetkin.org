import { FormattedDate } from 'react-intl';
import { grey } from '@material-ui/core/colors';
import NextLink from 'next/link';
import { Box, Link, List, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { useEffect, useRef } from 'react';

import WeekCalendarEvent from './WeekCalendarEvent';
import WeekCalendarTask from './WeekCalendarTask';
import { ZetkinCampaign, ZetkinEvent, ZetkinTask } from '../../../types/zetkin';


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
        // show lighter background color from 6am to 7pm
        background:`linear-gradient(${grey[300]} ${ONE_HOUR * 6}%, ${grey[200]} ${ONE_HOUR * 6}%, ${grey[200]} ${ONE_HOUR * 19}%, ${grey[300]} ${ONE_HOUR * 19}%)`,
        height: '100%',
        margin: 0,
        padding:0 ,
        position: 'relative',
        width: '100%',
    },
}));

const WeekCalendar = ({ orgId, baseHref, campaigns, events, focusDate, tasks }: WeekCalendarProps): JSX.Element => {
    const classes = useStyles();
    const calendar = useRef<HTMLDivElement>(null);
    const calendarWrapper = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const height = calendar.current?.clientHeight || 0;
        const y = height / 24 * 7; // approx 7am
        calendarWrapper.current?.scrollTo(0, y);
    }, []);

    const calendarStartDate = new Date(new Date(
        new Date(focusDate).setDate(
            new Date(focusDate).getDate() - new Date(focusDate).getDay() + 1,
        ),
    ).setHours(0, 0, 0, 0));

    const calendarEndDate = new Date(new Date(calendarStartDate)
        .setDate(calendarStartDate.getDate() + 7));

    const eventsOfTheWeek = events.filter(event => {
        return new Date(event.start_time) >= calendarStartDate &&
            new Date(event.start_time) < calendarEndDate ||
            new Date(event.end_time) > calendarStartDate &&
            new Date(event.end_time) <= calendarEndDate;
    });

    const tasksOfTheWeek = tasks.filter(task => {
        return new Date(task.deadline as string) >= calendarStartDate &&
        new Date(task.deadline as string) < calendarEndDate;
    });

    const getEventsOnThisDate = (date: number) => {
        return eventsOfTheWeek.filter(event => {
            return (
                new Date(event.start_time).getUTCDate() === date ||
                new Date(event.end_time).getUTCDate() === date);
        });
    };

    const getTasksOnThisDate = (start: Date, end: Date) => {
        return tasksOfTheWeek.filter(task => (
            isInRange(new Date(task.deadline as string), start, end)
        ));
    };

    const isInRange = (date: Date, start: Date, end: Date) => {
        return date > start &&
            date <= end;
    };

    return (
        <Box display="flex" flexDirection="column" height={ 1 }>
            <Box display="flex" flexDirection="column" flexGrow={ 0 } justifyContent="space-between">
                <Box display="flex">
                    { Array.from(Array(7).keys()).map((_, index) => (
                        <Box
                            key={ index }
                            alignItems="center"
                            data-testid="weekdays"
                            display="flex"
                            flexDirection="column"
                            justifyContent="flex-start"
                            width="100%">
                            <Typography component="h2" data-testid={ `weekday-${index}` } variant="subtitle2">
                                <FormattedDate
                                    value={ new Date(new Date(calendarStartDate).setDate(calendarStartDate.getDate() + index)) }
                                    weekday="short"
                                />
                            </Typography>
                            <Typography data-testid={ `date-${index}` }>
                                <FormattedDate
                                    day="2-digit"
                                    value={ new Date(new Date(calendarStartDate).setDate(calendarStartDate.getDate() + index)) }
                                />
                            </Typography>
                        </Box>
                    )) }
                </Box>
                <Box display="flex" flexDirection="column" mb={ 0.5 }>
                    { campaigns.map(c => {
                        const campaignEvents = events.filter(e => e.campaign.id === c.id)
                            .sort((a, b) => {
                                return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
                            });
                        return campaignEvents.length ? (
                            <CalendarBar key={ c.id } campaign={ c } events={ campaignEvents } firstCalendarDay={ calendarStartDate } orgId={ orgId }/>
                        ): null;
                    }) }
                </Box>
            </Box>
            <Box display="flex" justifyItems="space-between" pr={ 1.5 }>
                { Array.from(Array(7).keys()).map((_, index) => {
                    const startOfDay = new Date(new Date(new Date(calendarStartDate)
                        .setUTCDate(calendarStartDate.getDate() + index)).setUTCHours(0, 0, 0, 0));
                    const endOfDay = new Date(new Date(startOfDay).setDate(startOfDay.getDate() + 1));
                    return (
                        <Box key={ index } bgcolor={ grey[200] } flexBasis={ `${100 / 7}%` } flexGrow={ 0 } flexShrink={ 1 } mb={ 0.5 } overflow="hidden">
                            <List disablePadding>
                                { getTasksOnThisDate(startOfDay, endOfDay).map(task => {
                                    const campaign = campaigns.find(c => c.id === task.campaign.id);
                                    return <WeekCalendarTask key={ task.id } baseHref={ baseHref } campaign={ campaign } task={ task } />;
                                }) }
                            </List>
                        </Box>);
                }) }
            </Box>
            <Box data-testid="calendar-wrapper" { ...{ ref: calendarWrapper } } alignItems="center" flexGrow={ 1 } overflow="auto">
                <Box { ...{ ref: calendar } } display="flex" height="100rem" justifyContent="start">
                    { Array.from(Array(7).keys()).map((_, index) => {
                        const startOfDay = new Date(new Date(new Date(calendarStartDate)
                            .setUTCDate(calendarStartDate.getDate() + index)).setUTCHours(0, 0, 0, 0));
                        return (
                            <Box key={ index } display="flex" flexDirection="column" height={ 1 } justifyContent="space-between" mx={ 0.5 } width={ 1 }>
                                <List className={ classes.list } data-testid={ `day-${index}-events` }>
                                    { getEventsOnThisDate(startOfDay.getUTCDate())?.reduce((acc: [number, ZetkinEvent][], event: ZetkinEvent, index, array) => {
                                        const prevEvents = array.slice(0, index);
                                        const reversedPrevEvents = prevEvents.reverse();
                                        let shiftValue;
                                        const lastOverlappingEvent =
                                        reversedPrevEvents.find(prev => new Date(event.start_time) < new Date(prev.end_time));
                                        if (!lastOverlappingEvent) {
                                            shiftValue = 0;
                                        }
                                        else {
                                            const overlapIndex = acc.findIndex(e => e[1].id === lastOverlappingEvent.id);
                                            shiftValue = lastOverlappingEvent ? acc[overlapIndex][0] + 1 : 0;
                                        }
                                        return [
                                            ...acc,
                                            [shiftValue, event],
                                        ] as [number, ZetkinEvent][];
                                    }, [] ).map(eventWithShiftValue => {
                                        const [shiftValue, event] = eventWithShiftValue;
                                        const campaign = campaigns.find(c => c.id === event.campaign.id);
                                        return (
                                            <WeekCalendarEvent
                                                key={ event.id }
                                                baseHref={ baseHref }
                                                campaign={ campaign }
                                                event={ event }
                                                shiftValue={ shiftValue }
                                                startOfDay={ startOfDay }
                                            />
                                        );
                                    }) }
                                </List>
                            </Box>
                        );
                    }) }
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

const CalendarBar = ({ orgId, campaign, events, firstCalendarDay }: CalendarBarProps): JSX.Element | null => {
    const { id, color, title } = campaign;

    const lastCalendarDay = new Date(new Date(firstCalendarDay).setDate(firstCalendarDay.getDate() + 7));

    const barUnit = 100 / 7;

    const firstEventDate = new Date(events[0].start_time);
    const lastEventDate = new Date(events[events.length - 1].end_time);

    if (firstEventDate > lastCalendarDay || lastEventDate < firstCalendarDay) {
        return null;
    }

    let left, right;
    if (firstEventDate < firstCalendarDay ) {
        left = 0;
    }
    else {
        left = ((new Date(firstEventDate).getDay() || 7) - 1) * barUnit;
    }
    if (lastEventDate > lastCalendarDay) {
        right = 100;
    }
    else {
        right = ((new Date(lastEventDate).getDay() || 7) - 1)  * barUnit + barUnit;
    }
    if (right > 100) {
        right = 100;
    }

    const width = right - left;

    return (
        <Box height="0.5rem" position="relative" width={ 1 }>
            <NextLink href={ `/organize/${orgId}/campaigns/${id}` } passHref>
                <Link>
                    <Tooltip arrow data-testid={ `calendar-bar-popover-${id}` } title={ title }>
                        <Box
                            bgcolor={ color }
                            data-testid={ `calendar-bar-${id}` } height={ 1 } left={ `${left}%` } position="absolute" width={ `${width}%` }>
                        </Box>
                    </Tooltip>
                </Link>
            </NextLink>
        </Box>
    );
};
