import { ZetkinEvent } from '../types/zetkin';
import { ActionButton, Flex, View } from '@adobe/react-spectrum';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';

interface MonthCalendarProps {
    month: number;
    year: number;
    events: ZetkinEvent[];
    setSelectedDate: (offset: number) => void;
}

const MonthCalendar = ({ month, events, year, setSelectedDate }: MonthCalendarProps): JSX.Element => {

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

    const getBarPos = (currentMonth: number) => {

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

        const lastCalendarDay = new Date(new Date(firstCalendarDay).setDate(firstCalendarDay.getDate() + gridItems));

        const calendarEvents = getEventsInRange(firstCalendarDay, lastCalendarDay);

        if (calendarEvents.length === 0) return { height: 0, top: 0 };

        const firstEventDate = new Date(calendarEvents[0].start_time);
        const lastEventDate = new Date(calendarEvents[calendarEvents.length - 1].end_time);

        const top = getGridNumber(new Date(firstEventDate)) * barUnit;
        const height = (getGridNumber(new Date(lastEventDate)) * barUnit) - top;

        return { height, top };
    };

    return (
        <>
            <View position="absolute" right="15rem" top="-2.6rem">
                <Flex alignItems="center">
                    <ActionButton onPress={ () => setSelectedDate(-30) }>
                        <Msg id="misc.calendar.prev" />
                    </ActionButton>
                    <View padding="size-100">
                        <FormattedDate
                            month="long"
                            value={ new Date(year, month + 1, 0) }
                            year="numeric"
                        />
                    </View>
                    <ActionButton onPress={ () => setSelectedDate(30) }>
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
                        marginRight: '0.5rem',
                        position: 'relative',
                        width: '1rem',
                    }}>
                    <div
                        data-testid="calendar-bar"
                        style={{
                            backgroundColor: 'lightgray',
                            bottom: '2%',
                            height: `${getBarPos(month).height}%`,
                            position: 'absolute',
                            top: `${getBarPos(month).top + 2}%`,
                            width: '100%',
                        }}>
                    </div>
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
                                                background: 'lightgray',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                margin: '0.5rem 0',
                                                padding: '0 1rem',
                                                width: '100%',
                                            }}>{ `event with id ${event.id}` }
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