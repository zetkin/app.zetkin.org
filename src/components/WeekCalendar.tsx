import { getContrastColor } from '../utils/colorUtils';
import { grey } from '@material-ui/core/colors';
import { Box, Button, List, makeStyles, Typography } from '@material-ui/core';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';
import { useEffect, useRef } from 'react';
import { ZetkinCampaign, ZetkinEvent } from '../types/zetkin';


interface WeekCalendarProps {
    campaigns: ZetkinCampaign[];
    events: ZetkinEvent[];
    focusDate: Date;
    onFocusDate: (date: Date)=> void;
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

const WeekCalendar = ({ campaigns, events, focusDate, onFocusDate }: WeekCalendarProps): JSX.Element => {
    const classes = useStyles();
    const calendar = useRef<HTMLDivElement>(null);
    const calendarWrapper = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const height = calendar.current?.clientHeight || 0;
        const y = height / 24 * 7; // approx 7am
        calendarWrapper.current?.scrollTo(0, y);
    }, []);

    const calendarStartDate = new Date(
        new Date(focusDate).setDate(
            new Date(focusDate).getDate() - new Date(focusDate).getDay() + 1,
        ),
    );

    const calendarEndDate = new Date(new Date(calendarStartDate)
        .setDate(calendarStartDate.getDate() + 7));

    const eventsOfTheWeek = events.filter(event => {
        return new Date(event.start_time) >= calendarStartDate &&
            new Date(event.start_time) < calendarEndDate ||
            new Date(event.end_time) > calendarStartDate &&
            new Date(event.end_time) <= calendarEndDate;
    });

    const getEventsOfTheDay = (day: number) => {
        if (day === 7) day = 0; // sunday has index 0 in the Date object
        return eventsOfTheWeek.filter(event => (
            new Date(event.start_time).getUTCDay() === day ||
            new Date(event.end_time).getUTCDay() === day));
    };

    const getEventPos = (start: string, end: string) => {
        const oneMinute = 100 / 1440;
        const startTime = new Date(start);
        const endTime = new Date(end);
        const startFromMidnight = (startTime.getTime() - startTime.setUTCHours(0, 0, 0, 0)) / 60000;
        const endFromMidnight = (endTime.getTime() - endTime.setUTCHours(0, 0, 0, 0)) / 60000;
        const diff = endFromMidnight - startFromMidnight;

        return {
            height: `${diff * oneMinute}%`,
            top: `${startFromMidnight * oneMinute}%`,
        };
    };

    return (
        <Box { ...{ ref: calendarWrapper } } data-testid="calendar-wrapper" height={ 1 } overflow="scroll" width={ 1 }>
            <Box bgcolor={ grey[100] } display="flex" flexDirection="column" justifyContent="space-between" position="sticky" top={ 0 } width={ 1 } zIndex={ 1 }>
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
                        return campaignEvents.length && (
                            <CalendarBar key={ c.id } campaign={ c } events={ campaignEvents } firstCalendarDay={ calendarStartDate }/>
                        );
                    }) }
                </Box>
            </Box>
            <Box { ...{ ref: calendar } } alignItems="center" display="flex" height="100rem" justifyContent="start" width={ 1 }>
                { Array.from(Array(7).keys()).map((_, index) => (
                    <Box key={ index } display="flex" flexDirection="column" height={ 1 } justifyContent="space-between" mx={ 0.5 } width={ 1 }>
                        <List className={ classes.list } data-testid={ `day-${index}-events` }>
                            { getEventsOfTheDay(index + 1)?.map(event => {
                                const campaign = campaigns.find(c => c.id === event.campaign.id);
                                return (
                                    <li key={ event.id } data-testid={ `event-${event.id}` } style={{
                                        background: campaign?.color || grey[400],
                                        borderBottom: `2px solid ${grey[200]}`,
                                        color: getContrastColor(campaign?.color|| grey[400]),
                                        height: getEventPos(event.start_time, event.end_time).height,
                                        padding: '1rem',
                                        position: 'absolute',
                                        top: getEventPos(event.start_time, event.end_time).top,
                                        width: '100%',
                                    }}>
                                        { `event with id ${event.id} and campaign ${event.campaign.id}` }
                                    </li>
                                );
                            }) }
                        </List>
                    </Box>
                )) }
            </Box>
        </Box>
    );
};

export default WeekCalendar;

interface CalendarBarProps {
    campaign: ZetkinCampaign;
    events: ZetkinEvent[];
    firstCalendarDay: Date;
}

const CalendarBar = ({ campaign, events, firstCalendarDay }: CalendarBarProps): JSX.Element | null => {
    const { id, color } = campaign;

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
            <Box
                bgcolor={ color }
                data-testid={ `calendar-bar-${id}` } height={ 1 } left={ `${left}%` } position="absolute" width={ `${width}%` }>
            </Box>
        </Box>
    );
};