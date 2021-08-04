import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Box, Button, makeStyles, MenuItem, TextField, Typography } from '@material-ui/core';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';

import MonthCalendar from './MonthCalendar';
import { useFocusDate } from '../../hooks';
import { useIntl } from 'react-intl';
import WeekCalendar from './WeekCalendar';
import { ZetkinCampaign, ZetkinEvent, ZetkinTask } from '../../types/zetkin';

import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

enum CALENDAR_RANGES {
    MONTH = 'month',
    WEEK = 'week',
}

interface ZetkinCalendarProps {
    baseHref: string;
    events: ZetkinEvent[];
    campaigns: ZetkinCampaign[];
    tasks: ZetkinTask[];
}

const useStyles = makeStyles(() => ({
    today: {
        '&:hover':{
            backgroundColor: 'royalblue',
        },
        background: 'blue',
        borderRadius: '50%',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '18px',
        minWidth: '18px',
    },
}));

const ZetkinCalendar = ({ baseHref, events, campaigns , tasks }: ZetkinCalendarProps) : JSX.Element => {
    const { orgId } = useRouter().query;
    const intl = useIntl();
    const { focusDate, setFocusDate } = useFocusDate();
    const [range, setRange] = useState(CALENDAR_RANGES.MONTH);
    const classes = useStyles();

    const sortedEvents = [...events].sort((a, b) => {
        return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    });

    const tasksWithDeadlines = tasks.filter(task => task.deadline);

    const handleForwardButtonClick = () => {
        if (range === CALENDAR_RANGES.MONTH) {
            setFocusDate(new Date(focusDate.getFullYear(), focusDate.getMonth() + 1, focusDate.getDate()));
        }
        else if (range === CALENDAR_RANGES.WEEK) {
            setFocusDate(new Date(new Date(focusDate).setDate(focusDate.getDate() + 7)));
        }
    };

    const handleBackButtonClick = () => {
        if (range === CALENDAR_RANGES.MONTH) {
            setFocusDate(new Date(focusDate.getFullYear(), focusDate.getMonth() - 1, focusDate.getDate()));
        }
        else if (range === CALENDAR_RANGES.WEEK) {
            setFocusDate(new Date(new Date(focusDate).setDate(focusDate.getDate() - 7)));
        }
    };

    const isTodayBeforeView = () =>{
        if (focusDate.getFullYear() > dayjs().get('year')) return true;
        if (focusDate.getFullYear() < dayjs().get('year')) return false;
        //only needed if same year
        if (range === CALENDAR_RANGES.MONTH) {
            if (focusDate.getMonth() > dayjs().get('month')) return true;
        }
        else if (range === CALENDAR_RANGES.WEEK) {
            if (focusDate.getWeekNumber() > dayjs().week()) return true;
        }
        return false;
    };

    const isTodayAfterView = () =>{
        if (focusDate.getFullYear() < dayjs().get('year')) return true;
        if (focusDate.getFullYear() > dayjs().get('year')) return false;
        if (range === CALENDAR_RANGES.MONTH) {
            if (focusDate.getMonth() < dayjs().get('month')) return true;
        }
        else if (range === CALENDAR_RANGES.WEEK) {
            if (focusDate.getWeekNumber() < dayjs().week()) return true;
        }
        return false;
    };

    const handleTodayBtnClick = () => {
        setFocusDate(new Date());
    };

    return (
        <Box display="flex" flexDirection="column" height={ 1 }>
            <Box display="grid" flexGrow={ 0 } gridTemplateAreas={ `". nav view"` } gridTemplateColumns="repeat(3, minmax(0, 1fr))">
                <Box alignItems="center" display="flex" gridArea="nav" justifyContent="center">
                    {
                        isTodayBeforeView() && (<Button className={ classes.today } onClick={ handleTodayBtnClick }></Button>)
                    }
                    <Button color="primary" data-testid="back-button" onClick={ handleBackButtonClick }>
                        <Msg id="misc.calendar.prev" />
                    </Button>
                    <Box data-testid="selected-month" p={ 1 } textAlign="center" width="10rem">
                        <Typography>
                            { range === CALENDAR_RANGES.MONTH && (<FormattedDate
                                month="long"
                                value={ new Date(focusDate.getUTCFullYear(), focusDate.getUTCMonth() + 1, 0) }
                                year="numeric"
                            />) }
                            { range === CALENDAR_RANGES.WEEK && (new Date(new Date(
                                new Date(focusDate).setDate(
                                    new Date(focusDate).getDate() - new Date(focusDate).getDay() + 1,
                                ),
                            ).setHours(0, 0, 0, 0))).getWeekNumber() }
                        </Typography>
                    </Box>
                    <Button color="primary" data-testid="fwd-button" onClick={ handleForwardButtonClick }>
                        <Msg id="misc.calendar.next" />
                    </Button>
                    {
                        isTodayAfterView() && (<Button className={ classes.today } onClick={ handleTodayBtnClick }></Button>)
                    }
                </Box>
                <Box alignItems="center" display="flex" gridArea="view" justifySelf="end" mr={ 1 }>
                    <TextField
                        aria-label={ intl.formatMessage(
                            { id: 'misc.calendar.label' }) }
                        id="calendar-view"
                        onChange={ e => setRange(e.target.value as CALENDAR_RANGES) }
                        select
                        value={ range }>
                        { Object.values(CALENDAR_RANGES).map(range => (
                            <MenuItem key={ range } value={ range }>
                                <Msg id={ `misc.calendar.${range}` } />
                            </MenuItem>
                        )) }
                    </TextField>
                </Box>
            </Box>
            <Box flexGrow={ 1 } overflow="auto">
                { range === CALENDAR_RANGES.MONTH && (
                    <MonthCalendar
                        baseHref={ baseHref } campaigns={ campaigns } events={ sortedEvents } focusDate={ focusDate } orgId={ orgId as string } tasks={ tasksWithDeadlines }
                    />) }
                { range === CALENDAR_RANGES.WEEK && (
                    <WeekCalendar
                        baseHref={ baseHref } campaigns={ campaigns } events={ sortedEvents } focusDate={ focusDate } orgId={ orgId as string } tasks={ tasksWithDeadlines }
                    />) }
            </Box>
        </Box>
    );
};

export default ZetkinCalendar;
