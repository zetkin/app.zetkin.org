import { useRouter } from 'next/router';
import { useState } from 'react';
import { Box, Button, MenuItem, TextField, Typography } from '@material-ui/core';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';

import MonthCalendar from './MonthCalendar';
import { useFocusDate } from '../../hooks';
import { useIntl } from 'react-intl';
import WeekCalendar from './WeekCalendar';
import { ZetkinCampaign, ZetkinEvent } from '../../types/zetkin';

enum CALENDAR_RANGES {
    MONTH = 'month',
    WEEK = 'week',
}

interface ZetkinCalendarProps {
    baseHref: string;
    events: ZetkinEvent[];
    campaigns: ZetkinCampaign[];
}

const ZetkinCalendar = ({ baseHref, events, campaigns }: ZetkinCalendarProps) : JSX.Element => {
    const { orgId } = useRouter().query;
    const intl = useIntl();
    const { focusDate, setFocusDate } = useFocusDate();
    const [range, setRange] = useState(CALENDAR_RANGES.MONTH);

    const sortedEvents = [...events].sort((a, b) => {
        return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    });

    const calendars = [
        { id: CALENDAR_RANGES.WEEK, name: intl.formatMessage({ id: 'misc.calendar.week' }) },
        { id: CALENDAR_RANGES.MONTH, name: intl.formatMessage({ id: 'misc.calendar.month' }) },
    ];

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

    return (
        <Box display="flex" flexDirection="column" height={ 1 }>
            <Box display="grid" flexGrow={ 0 } gridTemplateAreas={ `". nav view"` } gridTemplateColumns="repeat(3, minmax(0, 1fr))">
                <Box alignItems="center" display="flex" gridArea="nav" justifyContent="center">
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
                </Box>
                <Box alignItems="center" display="flex" gridArea="view" justifySelf="end" mr={ 1 }>
                    <TextField
                        aria-label={ intl.formatMessage(
                            { id: 'misc.calendar.label' }) }
                        id="calendar-view"
                        onChange={ e => setRange(e.target.value as CALENDAR_RANGES) }
                        select
                        value={ range }>
                        { calendars.map(item => (
                            <MenuItem key={ item.id } value={ item.id }>
                                { item.name }
                            </MenuItem>
                        )) }
                    </TextField>
                </Box>
            </Box>
            <Box flexGrow={ 1 } overflow="auto">
                { range === CALENDAR_RANGES.MONTH && (
                    <MonthCalendar
                        baseHref={ baseHref } campaigns={ campaigns } events={ sortedEvents } focusDate={ focusDate } orgId={ orgId as string }
                    />) }
                { range === CALENDAR_RANGES.WEEK && (
                    <WeekCalendar
                        baseHref={ baseHref } campaigns={ campaigns } events={ sortedEvents } focusDate={ focusDate } orgId={ orgId as string }
                    />) }
            </Box>
        </Box>
    );
};

export default ZetkinCalendar;
