import { grey } from '@material-ui/core/colors';
import NextLink from 'next/link';
import { Box, Button, Link, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';
import  { useEffect, useRef, useState } from 'react';

import MonthCalendarEvent from './MonthCalendarEvent';
import { ZetkinCampaign, ZetkinEvent } from '../../../types/zetkin';

interface MonthCalendarProps {
    baseHref: string;
    campaigns: ZetkinCampaign[];
    events: ZetkinEvent[];
    focusDate: Date;
    orgId: string;
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

const useStyles = makeStyles(() => ({
    list: {
        flexGrow: 1,
        listStyle: 'none',
        margin: 0,
        padding: 0,
    },
}));

const MonthCalendar = ({ orgId, campaigns, baseHref, events, focusDate }: MonthCalendarProps): JSX.Element => {
    const gridItem = useRef<HTMLUListElement>(null);
    const windowHeight = useWindowHeight();
    const [maxNoOfEvents, setMaxNoOfEvents] = useState(1);
    const [listItemHeight, setListItemHeight] = useState(0);

    useEffect(() => {
        const gridItemHeight = gridItem.current?.offsetHeight || 0;
        setMaxNoOfEvents(listItemHeight ? Math.floor((gridItemHeight - listItemHeight * 2) / listItemHeight) : 1);
    }, [focusDate, windowHeight, listItemHeight]);

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
        <Box display="flex" flexGrow={ 1 } height={ 1 } overflow="auto">
            <Box display="flex" mr={ 0.5 }>
                { campaigns.map(c => {
                    const campaignEvents = events.filter(e => e.campaign.id === c.id)
                        .sort((a, b) => {
                            return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
                        });
                    return campaignEvents.length ? (
                        <CalendarBar
                            key={ c.id }
                            campaign={ c }
                            events={ campaignEvents }
                            firstCalendarDay={ firstCalendarDay }
                            firstMonthDay={ firstMonthDay }
                            gridItems={ gridItems }
                            month={ month }
                            orgId={ orgId }
                            totalDaysInMonth={ totalDaysInMonth }
                        />
                    ) : null;
                }) }
            </Box>
            <Box
                data-testid="calendar-wrapper"
                display="grid"
                gridTemplateColumns="repeat(7, minmax(125px, 1fr))"
                gridTemplateRows={ `repeat(${calendarRows}, minmax(125px, 1fr))` }
                width={ 1 }>
                { Array.from(Array(gridItems).keys()).map((_, index) => {
                    const currentDate = new Date(new Date(firstCalendarDay).setDate(firstCalendarDay.getDate() + index));
                    const daysEvents = getEventsInRange(currentDate, new Date(new Date(currentDate).setDate(currentDate.getDate() + 1)));
                    const totalEvents = daysEvents.length;
                    return (
                        <Box
                            key={ index }
                            bgcolor={ isInRange(currentDate, firstMonthDay, lastMonthDay) ? grey[200] : grey[300] }
                            data-testid={ `griditem-${index}` }
                            display="flex"
                            flexDirection="column"
                            m={ 0.1 }
                            position="relative">
                            <Box p={ 0.5 } pb={ 0 }>
                                <Typography>
                                    <FormattedDate
                                        day="2-digit"
                                        value={ currentDate }
                                    />
                                </Typography>
                            </Box>
                            <ul { ...( index === 0 && { ref: gridItem }) } className={ classes.list } data-testid={ `day-${index}-events` }>
                                { daysEvents.map((event, i) => {
                                    const campaign = campaigns.find(c => c.id === event.campaign.id);
                                    return (
                                        <MonthCalendarEvent
                                            key={ event.id }
                                            baseHref={ baseHref }
                                            campaign={ campaign }
                                            event={ event }
                                            isVisible={ i < maxNoOfEvents }
                                            onLoad={ i === 0 ? (listItemHeight) => setListItemHeight(listItemHeight) : undefined }
                                            startOfDay={ currentDate }
                                        />
                                    );
                                }) }
                            </ul>
                            { totalEvents - maxNoOfEvents > 0 && (
                                <Tooltip arrow interactive title={ (
                                    <Box>
                                        <ul className={ classes.list } data-testid={ `day-${index}-events` }>
                                            { daysEvents.map((event, i) => {
                                                const campaign = campaigns.find(c => c.id === event.campaign.id);
                                                return (
                                                    <MonthCalendarEvent
                                                        key={ event.id }
                                                        baseHref={ baseHref }
                                                        campaign={ campaign }
                                                        event={ event }
                                                        isVisible={ i >= maxNoOfEvents }
                                                        startOfDay={ currentDate }
                                                    />
                                                );
                                            }) }
                                        </ul>
                                    </Box>
                                ) }>
                                    <Button disableRipple style={{ padding: 0 }}>
                                        <Typography variant="body1">
                                            <Msg id="misc.calendar.moreEvents" values={{ numEvents: totalEvents - maxNoOfEvents }} />
                                        </Typography>
                                    </Button>
                                </Tooltip>
                            ) }
                        </Box>
                    );
                }) }
            </Box>
        </Box>
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
