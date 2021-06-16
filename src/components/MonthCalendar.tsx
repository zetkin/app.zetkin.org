import { getContrastColor } from '../utils/colorUtils';
import { grey } from '@material-ui/core/colors';
import { Box, Button, List, Typography } from '@material-ui/core';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';
import { ZetkinCampaign, ZetkinEvent } from '../types/zetkin';

interface MonthCalendarProps {
    campaigns: ZetkinCampaign[];
    events: ZetkinEvent[];
    focusDate: Date;
    onFocusDate: (date: Date) => void;
}

const MonthCalendar = ({ campaigns, events, onFocusDate, focusDate }: MonthCalendarProps): JSX.Element => {
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
            <Box alignItems="center" display="flex" position="absolute" right="15rem" top="-2.6rem">
                <Button color="primary" data-testid="back-button" onClick={
                    () => onFocusDate(new Date(focusDate.getFullYear(), focusDate.getMonth() - 1, focusDate.getDate()))
                }>
                    <Msg id="misc.calendar.prev" />
                </Button>
                <Box data-testid="selected-month" p={ 1 }>
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
            <Box display="flex" minHeight={ 1 }>
                <Box display="flex" mr={ 0.5 }>
                    { campaigns.map(c => {
                        const campaignEvents = events.filter(e => e.campaign.id === c.id)
                            .sort((a, b) => {
                                return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
                            });
                        return campaignEvents.length && (
                            <CalendarBar key={ c.id } campaign={ c } events={ campaignEvents } firstCalendarDay={ firstCalendarDay } firstMonthDay={ firstMonthDay } gridItems={ gridItems } month={ month } totalDaysInMonth={ totalDaysInMonth }/>
                        );
                    }) }
                </Box>
                <Box data-testid="calendar-wrapper" display="grid" gridTemplateColumns="repeat(7, minmax(125px, 1fr))" gridTemplateRows={ `repeat(${calendarRows}, minmax(125px, 1fr))` }>
                    { Array.from(Array(gridItems).keys()).map((_, index) => {
                        const currentDate = new Date(new Date(firstCalendarDay).setDate(firstCalendarDay.getDate() + index));

                        return (
                            <Box key={ index } bgcolor={ isInRange(currentDate, firstMonthDay, lastMonthDay) ? grey[300] : grey[200] } data-testid={ `griditem-${index}` } m={ 0.5 } position="relative">
                                <Typography>
                                    <Box p={ 1 }>
                                        <FormattedDate
                                            day="2-digit"
                                            value={ currentDate }
                                        />
                                    </Box>
                                </Typography>
                                <List data-testid={ `day-${index}-events` }>
                                    { getEventsInRange(currentDate, new Date(new Date(currentDate).setDate(currentDate.getDate() + 1))).map(event => {
                                        const campaign = campaigns.find(c => c.id === event.campaign.id);
                                        return (
                                            <li
                                                key={ event.id } data-testid={ `event-${event.id}` } style={{
                                                    alignItems: 'center',
                                                    background: campaign?.color || grey[400],
                                                    color: getContrastColor(campaign?.color|| grey[400]),
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    margin: '0.5rem 0',
                                                    padding: '0 1rem',
                                                    width: '100%',
                                                }}>{ `event with id ${event.id} and campaign ${event.campaign.id}` }
                                            </li>
                                        );
                                    }) }
                                </List>
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
}

const CalendarBar = ({ campaign, events, month, gridItems, firstCalendarDay, firstMonthDay, totalDaysInMonth }: CalendarBarProps): JSX.Element | null => {
    const { id, color } = campaign;

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
            <Box
                bgcolor={ color }
                data-testid={ `calendar-bar-${id}` } height={ `${height}%` } position="absolute" top={ `${top}%` } width={ 1 }>
            </Box>
        </Box>
    );
};