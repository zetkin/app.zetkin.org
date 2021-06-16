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

const useStyles = makeStyles(() => ({
    list: {
        background:grey[200],
        height: '100%',
        margin: 0,
        padding:0 ,
        position: 'relative',
        width: '100%',
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
        <>
            <Box alignItems="center" display="flex" position="absolute" right="15rem" top="-2.6rem">
                <Button color="primary" data-testid="back-button" onClick={
                    () => onFocusDate(new Date(new Date(focusDate).setDate(focusDate.getDate() - 7))) }>
                    <Msg id="misc.calendar.prev" />
                </Button>
                <Box data-testid="selected-date" px={ 1 }>
                    <FormattedDate
                        day="2-digit"
                        month="short"
                        value={ calendarStartDate }
                    />
                </Box>
                <Button color="primary" data-testid="fwd-button" onClick={
                    () => onFocusDate(new Date(new Date(focusDate).setDate(focusDate.getDate() + 7))) }>
                    <Msg id="misc.calendar.next" />
                </Button>
            </Box>
            <Box { ...{ ref: calendarWrapper } } data-testid="calendar-wrapper" height={ 1 } overflow="scroll" width={ 1 }>
                <Box bgcolor={ grey[100] } display="flex" justifyContent="space-between" position="sticky" top={ 0 } width={ 1 } zIndex={ 1 }>
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
                <Box { ...{ ref: calendar } } alignItems="center" display="flex" height="100rem" justifyContent="start" width={ 1 }>
                    { Array.from(Array(7).keys()).map((_, index) => (
                        <Box key={ index } display="flex" flexDirection="column" height={ 1 } justifyContent="space-between" mx={ 0.5 } width={ 1 }>
                            <List className={ classes.list } data-testid={ `day-${index}-events` }>
                                { getEventsOfTheDay(index + 1)?.map(event => {
                                    const campaign = campaigns.find(c => c.id === event.campaign.id);
                                    return (
                                        <li key={ event.id } data-testid={ `event-${event.id}` } style={{
                                            background: campaign?.color || grey[400],
                                            color: getContrastColor(campaign?.color|| grey[400]),
                                            height: getEventPos(event.start_time, event.end_time).height,
                                            margin: '1rem 0',
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
        </>
    );
};

export default WeekCalendar;
