import { grey } from '@material-ui/core/colors';
import NextLink from 'next/link';
import { Box, Button, Link, List, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';
import { useEffect, useRef } from 'react';

import WeekCalendarEvent from './WeekCalendarEvent';
import { ZetkinCampaign, ZetkinEvent } from '../../../types/zetkin';


interface WeekCalendarProps {
    baseHref: string;
    campaigns: ZetkinCampaign[];
    events: ZetkinEvent[];
    focusDate: Date;
    onFocusDate: (date: Date)=> void;
    orgId: string;
}

const useStyles = makeStyles((theme) => ({
    list: {
        background:grey[200],
        height: '100%',
        margin: 0,
        padding:0 ,
        position: 'relative',
        width: '100%',
    },
    responsiveFlexBox: {
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'flex-start',
        },
    },
}));

const WeekCalendar = ({ orgId, baseHref, campaigns, events, focusDate, onFocusDate }: WeekCalendarProps): JSX.Element => {
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

    const getEventsOnThisDate = (date: number) => {
        return eventsOfTheWeek.filter(event => {
            return (
                new Date(event.start_time).getUTCDate() === date ||
                new Date(event.end_time).getUTCDate() === date);
        });
    };

    return (
        <Box { ...{ ref: calendarWrapper } } data-testid="calendar-wrapper" height={ 1 } overflow="auto" width={ 1 }>
            <Box bgcolor={ grey[100] } display="flex" flexDirection="column" justifyContent="space-between" position="sticky" top={ 0 } width={ 1 } zIndex={ 11 }>
                <Box alignItems="center" className={ classes.responsiveFlexBox } display="flex" justifyContent="center">
                    <Button color="primary" data-testid="back-button" onClick={
                        () => onFocusDate(new Date(new Date(focusDate).setDate(focusDate.getDate() - 7))) }>
                        <Msg id="misc.calendar.prev" />
                    </Button>
                    <Box data-testid="selected-date" px={ 1 }>
                        { calendarStartDate.getWeekNumber() }
                    </Box>
                    <Button color="primary" data-testid="fwd-button" onClick={
                        () => onFocusDate(new Date(new Date(focusDate).setDate(focusDate.getDate() + 7))) }>
                        <Msg id="misc.calendar.next" />
                    </Button>
                </Box>
                <Box display="flex">
                    { Array.from(Array(7).keys()).map((_, index) => (
                        <Box key={ index } alignItems="center" data-testid="weekdays" display="flex" flexDirection="column" justifyContent="flex-start" width="100%">
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
            <Box { ...{ ref: calendar } } alignItems="center" display="flex" height="100rem" justifyContent="start" width={ 1 }>
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
                                        <WeekCalendarEvent key={ event.id } baseHref={ baseHref } campaign={ campaign } event={ event } shiftValue={ shiftValue } startOfDay={ startOfDay } />
                                    );
                                }) }
                            </List>
                        </Box>
                    );
                }) }
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
