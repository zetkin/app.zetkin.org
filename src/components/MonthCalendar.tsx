import randomSeed from 'random-seed';
import { ZetkinEvent } from '../types/zetkin';
import { ActionButton, Flex, View } from '@adobe/react-spectrum';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';

interface MonthCalendarProps {
    events: ZetkinEvent[];
    focusDate: Date;
    onFocusDate: (date: Date) => void;
}

const MonthCalendar = ({ events, onFocusDate, focusDate }: MonthCalendarProps): JSX.Element => {
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

    const campIdsArray = Array.from(new Set(getEventsInRange(firstCalendarDay, lastCalendarDay).map(e => e.campaign.id)));

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

        const calendarEvents = getEventsInRange(firstCalendarDay, lastCalendarDay).filter(e => e.campaign.id === campId);

        if (calendarEvents.length === 0) return { height: 0, top: 0 };

        const firstEventDate = new Date(calendarEvents[0].start_time);
        const lastEventDate = new Date(calendarEvents[calendarEvents.length - 1].end_time);

        const top = getGridNumber(new Date(firstEventDate)) * barUnit;
        let height = (getGridNumber(new Date(lastEventDate)) * barUnit) - top;
        if (height === 0) height = barUnit;
        return { height, top };
    };

    const getCampColors = (campId: number) => {
        if (!campId) return {
            bg: 'lightgrey',
            fg: 'black',
        };
        const rand = randomSeed.create(campId.toString());
        const bgR = rand(256);
        const bgG = 0;
        const bgB = rand(256);
        let fgB = 255, fgG = 255, fgR = 255;

        // Use black text on light backgrounds (when color component
        // average is greater than 180).
        const bgAvg = (bgR + bgG + bgB) / 3.0;
        if (bgAvg > 180) {
            fgR = fgG = fgB = 0;
        }
        return {
            bg: `rgb(${bgR},${bgG},${bgB})`,
            fg: `rgb(${fgR},${fgG},${fgB})`,
        };
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
                height: '100%',
            }}>
                <div
                    style={{
                        display: 'flex',
                        height: '100%',
                        marginRight: '0.5rem',
                    }}>
                    { campIdsArray.map(campId => (
                        <div key={ campId } style={{
                            height: '100%',
                            position: 'relative',
                            width: '0.5rem',
                        }}>
                            <div
                                data-testid={ `calendar-bar-${campId}` }
                                style={{
                                    backgroundColor: getCampColors(campId).bg,
                                    bottom: '2%',
                                    height: `${getBarPos(month, campId).height}%`,
                                    position: 'absolute',
                                    top: `${getBarPos(month, campId).top + 2}%`,
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
                    height: '100%',
                    overflow: 'scroll',
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