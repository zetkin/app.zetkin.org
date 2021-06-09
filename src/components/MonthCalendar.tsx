import { ActionButton, Flex, View } from '@adobe/react-spectrum';
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

    const lastCalendarDay = new Date(new Date(firstCalendarDay).setDate(firstCalendarDay.getDate() + gridItems));

    const campIds = campaigns.map(c => +c.id);

    const getBarPos = (currentMonth: number, campId: number) => {

        const barUnit = 100 / gridItems;

        const getGridNumber = (event: Date) => {
            const offset = (firstMonthDay.getDay() || 7) - 2;
            if (event.getMonth() === month) {
                return new Date(event).getDate() + offset;
            }
            if (event.getMonth() < currentMonth) {
                return (new Date(event).getDay() || 7) - 1;
            }
            if (event.getMonth() > currentMonth) {
                return (new Date(event).getDay() || 7) - 3 + offset + totalDaysInMonth;
            }
            return 0;
        };

        const campaignEvents = events.filter(e => e.campaign.id === campId)
            .sort((a, b) => {
                return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
            });

        if (campaignEvents.length === 0) {
            return { height: 0, top: 0 };
        }

        const firstEventDate = new Date(campaignEvents[0].start_time);
        const lastEventDate = new Date(campaignEvents[campaignEvents.length - 1].end_time);

        let bottom, top;
        if (firstEventDate < firstCalendarDay ) {
            top = 0;
        }
        else if (firstEventDate > lastCalendarDay) {
            top = 100;
        }
        else {
            top = getGridNumber(new Date(firstEventDate)) * barUnit;
        }

        if (lastEventDate > lastCalendarDay) {
            bottom = 100;
        }
        else if (lastEventDate < firstCalendarDay) {
            bottom = 0;
        }
        else {
            bottom = getGridNumber(new Date(lastEventDate)) * barUnit;
        }
        if (bottom > 100) {
            bottom = 100;
        }

        const height = bottom - top;
        return { height, top };
    };

    const getCampColors = (campId?: number) => {
        const currentCampaign = campaigns.find(c => c.id === campId);
        if (!currentCampaign?.color) {
            return { bg: '#d3d3d3', fg: '#00000' };
        }
        const bgColor = parseInt(currentCampaign.color.slice(1), 16);
        const bgR = bgColor >> 16;
        const bgG = bgColor >> 8 & 255;
        const bgB = bgColor & 255;
        let fgB = 255, fgG = 255, fgR = 255;
        const bgAvg = (bgR + bgG + bgB) / 3.0;
        if (bgAvg > 150) {
            fgR = fgG = fgB = 0;
        }
        const bg = '#' + ((bgR << 16) | (bgG << 8) | bgB)
            .toString(16).padStart(6, '0');
        const fg = '#' + ((fgR << 16) | (fgG << 8) | fgB)
            .toString(16).padStart(6, '0');

        return { bg, fg };
    };

    return (
        <>
            <View position="absolute" right="15rem" top="-2.6rem">
                <Flex alignItems="center">
                    <ActionButton data-testid="back-button" onPress={
                        () => onFocusDate(new Date(focusDate.getFullYear(), focusDate.getMonth() - 1, focusDate.getDate()))
                    }>
                        <Msg id="misc.calendar.prev" />
                    </ActionButton>
                    <View data-testid="selected-month" padding="size-100">
                        <FormattedDate
                            month="long"
                            value={ new Date(year, month + 1, 0) }
                            year="numeric"
                        />
                    </View>
                    <ActionButton data-testid="fwd-button" onPress={
                        () => onFocusDate(new Date(focusDate.getFullYear(), focusDate.getMonth() + 1, focusDate.getDate()))
                    }>
                        <Msg id="misc.calendar.next" />
                    </ActionButton>
                </Flex>
            </View>
            <div style={{
                display: 'flex',
                minHeight: '100%',
            }}>
                <div
                    style={{
                        display: 'flex',
                        marginRight: '0.5rem',
                    }}>
                    { campIds.map(campId => (
                        <div key={ campId } style={{
                            height: '100%',
                            position: 'relative',
                            width: '0.5rem',
                        }}>
                            <div
                                data-testid={ `calendar-bar-${campId}` }
                                style={{
                                    backgroundColor: getCampColors(campId).bg,
                                    display: getBarPos(month, campId).height? 'block' : 'none',
                                    height: `${getBarPos(month, campId).height}%`,
                                    position: 'absolute',
                                    top: `${getBarPos(month, campId).top}%`,
                                    width: '100%',
                                }}>
                            </div>
                        </div>
                    )) }
                </div>
                <div data-testid="calendar-wrapper" style={{
                    display: 'grid',
                    flexGrow: 1,
                    gap: '0.5rem',
                    gridTemplateColumns: 'repeat(7, minmax(125px, 1fr))',
                    gridTemplateRows: `repeat(${calendarRows}, minmax(125px, 1fr))`,
                }}>
                    { Array.from(Array(gridItems).keys()).map((_, index) => {
                        const currentDate = new Date(new Date(firstCalendarDay).setDate(firstCalendarDay.getDate() + index));

                        return (
                            <div key={ index } data-testid={ `griditem-${index}` } style={{
                                background: isInRange(currentDate, firstMonthDay, lastMonthDay) ? 'grey' : 'whitesmoke',
                                position: 'relative',
                            }}>
                                <div style={{
                                    top: 0,
                                }}>
                                    <FormattedDate
                                        day="2-digit"
                                        value={ currentDate }
                                    />
                                </div>
                                <ul data-testid={ `day-${index}-events` } style={{
                                    listStyle: 'none',
                                    margin: 0,
                                    padding:0 ,
                                    width: '100%',
                                }}>
                                    { getEventsInRange(currentDate, new Date (new Date(currentDate).setDate(currentDate.getDate() + 1))).map(event => (
                                        <li
                                            key={ event.id } data-testid={ `event-${event.id}` } style={{
                                                alignItems: 'center',
                                                background: getCampColors(event.campaign.id).bg,
                                                color: getCampColors(event.campaign.id).fg,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                margin: '0.5rem 0',
                                                padding: '0 1rem',
                                                width: '100%',
                                            }}>{ `event with id ${event.id} and campaign ${event.campaign.id}` }
                                        </li>
                                    )) }
                                </ul>
                            </div>
                        );
                    }) }
                </div>
            </div>
        </>
    );
};

export default MonthCalendar;