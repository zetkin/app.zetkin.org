import { getContrastColor } from '../../../utils/colorUtils';
import { grey } from '@material-ui/core/colors';
import NextLink from 'next/link';
import { Box, Button, Link, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { FormattedDate, FormattedTime, FormattedMessage as Msg } from 'react-intl';
import  { useEffect, useRef, useState } from 'react';
import { ZetkinCampaign, ZetkinEvent } from '../../../types/zetkin';

interface MonthCalendarProps {
    baseHref: string;
    campaigns: ZetkinCampaign[];
    events: ZetkinEvent[];
    focusDate: Date;
    orgId: string;
    onFocusDate: (date: Date) => void;
}

const useWindowHeight = (): number | undefined => {
    const [windowHeight, setWindowHeight] = useState<number | undefined>(undefined);
    useEffect(() => {
        const handleResize = () =>  setWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return windowHeight;
};

const useStyles = makeStyles((theme) => ({
    list: {
        flexGrow: 1,
        listStyle: 'none',
        margin: 0,
        padding: 0,
    },
    responsiveFlexBox: {
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'flex-start',
        },
    },
}));

const MonthCalendar = ({ orgId, campaigns, baseHref, events, onFocusDate, focusDate }: MonthCalendarProps): JSX.Element => {
    const gridItem = useRef<HTMLUListElement>(null);
    const listItem = useRef<HTMLDivElement>(null);
    const windowHeight = useWindowHeight();
    const [maxNoOfEvents, setMaxNoOfEvents] = useState(1);

    useEffect(() => {
        const gridItemHeight = gridItem.current?.offsetHeight || 0;
        const listItemHeight = listItem.current?.offsetHeight || 0 * 1.5;
        setMaxNoOfEvents(listItemHeight ? Math.floor((gridItemHeight - listItemHeight * 2) / listItemHeight) : 1);
    }, [focusDate, windowHeight]);

    const classes = useStyles();
    const month = focusDate.getUTCMonth();
    const year = focusDate.getUTCFullYear();
    const totalDaysInMonth = new Date(year, 1 + month, 0).getDate();

    const firstMonthDay = new Date(year, month, 1);
    const lastMonthDay = new Date(year, month, totalDaysInMonth + 1);
    const firstCalendarDay = new Date(new Date(firstMonthDay).setDate(firstMonthDay.getDate() - (firstMonthDay.getDay() || 7) + 1 ));

    let calendarRows = 5;

    if (totalDaysInMonth === 28 && firstMonthDay.getDay() === 1) {
        calendarRows = 4;
    }

    if ((totalDaysInMonth === 31 && firstMonthDay.getDay() === 6) || (totalDaysInMonth === 31 && firstMonthDay.getDay() === 0) || (totalDaysInMonth === 30 && firstMonthDay.getDay() === 0)) {
        calendarRows = 6;
    }

    const gridItems = calendarRows * 7;

    const getEventsInRange = (start: Date, end:Date) => events.filter(event => {
        return new Date(event.start_time) >= start &&
            new Date(event.start_time) < end ||
            new Date(event.end_time) > start &&
            new Date(event.end_time) <= end;
    });

    const isInRange = (date: Date, start: Date, end: Date) => {
        return date >= start &&
            date < end;
    };

    return (
        <>
            <Box alignItems="center" bgcolor={ grey[100] } position="sticky" top={ 0 } zIndex={ 1 }>
                <Box alignItems="center" className={ classes.responsiveFlexBox } display="flex" justifyContent="center">
                    <Button color="primary" data-testid="back-button" onClick={
                        () => onFocusDate(new Date(focusDate.getFullYear(), focusDate.getMonth() - 1, focusDate.getDate()))
                    }>
                        <Msg id="misc.calendar.prev" />
                    </Button>
                    <Box data-testid="selected-month" p={ 1 } textAlign="center" width="8rem">
                        <FormattedDate
                            month="long"
                            value={ new Date(year, month + 1, 0) }
                            year="numeric"
                        />
                    </Box>
                    <Button color="primary" data-testid="fwd-button" onClick={
                        () => onFocusDate(new Date(focusDate.getFullYear(), focusDate.getMonth() + 1, focusDate.getDate()))
                    }>
                        <Msg id="misc.calendar.next" />
                    </Button>
                </Box>
            </Box>
            <Box display="flex" height={ 1 }>
                <Box display="flex" mr={ 0.5 }>
                    { campaigns.map(c => {
                        const campaignEvents = events.filter(e => e.campaign.id === c.id)
                            .sort((a, b) => {
                                return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
                            });
                        return campaignEvents.length ? (
                            <CalendarBar key={ c.id } campaign={ c } events={ campaignEvents } firstCalendarDay={ firstCalendarDay } firstMonthDay={ firstMonthDay } gridItems={ gridItems } month={ month } orgId={ orgId } totalDaysInMonth={ totalDaysInMonth }/>
                        ) : null;
                    }) }
                </Box>
                <Box data-testid="calendar-wrapper" display="grid" gridTemplateColumns="repeat(7, minmax(125px, 1fr))" gridTemplateRows={ `repeat(${calendarRows}, minmax(125px, 1fr))` } width={ 1 }>
                    { Array.from(Array(gridItems).keys()).map((_, index) => {
                        const currentDate = new Date(new Date(firstCalendarDay).setDate(firstCalendarDay.getDate() + index));
                        const daysEvents = getEventsInRange(currentDate, new Date(new Date(currentDate).setDate(currentDate.getDate() + 1)));
                        const totalEvents = daysEvents.length;
                        return (
                            <Box key={ index } bgcolor={ isInRange(currentDate, firstMonthDay, lastMonthDay) ? grey[200] : grey[300] } data-testid={ `griditem-${index}` } display="flex" flexDirection="column" m={ 0.1 } position="relative">
                                <Box p={ 0.5 } pb={ 0 }>
                                    <Typography>
                                        <FormattedDate
                                            day="2-digit"
                                            value={ currentDate }
                                        />
                                    </Typography>
                                </Box>
                                <ul { ...( index === 0 && { ref: gridItem } ) } className={ classes.list } data-testid={ `day-${index}-events` }>
                                    { daysEvents.map((event, i) => {
                                        const campaign = campaigns.find(c => c.id === event.campaign.id);
                                        const naiveStartTime = new Date(event.start_time);

                                        const startTime = new Date(naiveStartTime.getUTCFullYear(), naiveStartTime.getUTCMonth(), naiveStartTime.getUTCDate(), naiveStartTime.getUTCHours(), naiveStartTime.getUTCMinutes());
                                        const startsBeforeToday = startTime <= currentDate;
                                        return (
                                            <li key={ event.id }>
                                                <NextLink href={  baseHref + `/calendar/events/${event.id}` } passHref>
                                                    <Link underline="none">
                                                        <div
                                                            { ...( i === 0 && { ref: listItem } ) }
                                                            data-testid={ `event-${event.id}` } style={{
                                                                background: campaign?.color || grey[400],
                                                                color: getContrastColor(campaign?.color|| grey[400]),
                                                                display: i < maxNoOfEvents ? 'block' : 'none',
                                                                margin: '0 0 0.2rem 0',
                                                                padding: '0 0.5rem',
                                                                width: '100%',
                                                            }}>
                                                            <Typography noWrap={ true } variant="body2">
                                                                <FormattedTime value={ new Date(startsBeforeToday? currentDate: startTime) }/>{ ` - ` }
                                                                { event.title || event.activity.title }
                                                            </Typography>
                                                        </div>
                                                    </Link>
                                                </NextLink>
                                            </li>
                                        );
                                    }) }
                                    { totalEvents - maxNoOfEvents > 0 && (
                                        <li style={{
                                            margin: '0 0 0.2rem 0',
                                            padding: '0 0.5rem',
                                            width: '100%',
                                        }}>
                                            <Typography>
                                                { totalEvents - maxNoOfEvents } more events
                                            </Typography>
                                        </li>
                                    ) }
                                </ul>
                            </Box>
                        );
                    }) }
                </Box>
            </Box>
        </>
    );
};

export default MonthCalendar;

interface CalendarBarProps {
    campaign: ZetkinCampaign;
    month: number;
    events: ZetkinEvent[];
    firstCalendarDay: Date;
    firstMonthDay: Date;
    totalDaysInMonth: number;
    gridItems: number;
    orgId: string;
}

const CalendarBar = ({ orgId, campaign, events, month, gridItems, firstCalendarDay, firstMonthDay, totalDaysInMonth }: CalendarBarProps): JSX.Element | null => {
    const { id, color, title } = campaign;

    const lastCalendarDay = new Date(new Date(firstCalendarDay).setDate(firstCalendarDay.getDate() + gridItems));

    const barUnit = 100 / gridItems;

    const getGridNumber = (event: Date) => {
        const offset = (firstMonthDay.getDay() || 7) - 2;
        if (event.getMonth() === month) {
            return new Date(event).getDate() + offset;
        }
        if (event.getMonth() < month) {
            return (new Date(event).getDay() || 7) - 1;
        }
        if (event.getMonth() > month) {
            return (new Date(event).getDay() || 7) - 3 + offset + totalDaysInMonth;
        }
        return 0;
    };

    const firstEventDate = new Date(events[0].start_time);
    const lastEventDate = new Date(events[events.length - 1].end_time);

    if (firstEventDate > lastCalendarDay || lastEventDate < firstCalendarDay) {
        return null;
    }

    let bottom, top;
    if (firstEventDate < firstCalendarDay ) {
        top = 0;
    }
    else {
        top = getGridNumber(new Date(firstEventDate)) * barUnit;
    }
    if (lastEventDate > lastCalendarDay) {
        bottom = 100;
    }
    else {
        bottom = getGridNumber(new Date(lastEventDate)) * barUnit;
    }
    if (bottom > 100) {
        bottom = 100;
    }

    const height = bottom - top;

    return (
        <Box height={ 1 } position="relative" width="0.5rem">
            <NextLink href={ `/organize/${orgId}/campaigns/${id}` } passHref>
                <Link>
                    <Tooltip arrow data-testid={ `calendar-bar-popover-${id}` } placement="top" title={ title }>
                        <Box
                            bgcolor={ color }
                            data-testid={ `calendar-bar-${id}` } height={ `${height}%` } position="absolute" top={ `${top}%` } width={ 1 }>
                        </Box>
                    </Tooltip>
                </Link>
            </NextLink>
        </Box>
    );
};
