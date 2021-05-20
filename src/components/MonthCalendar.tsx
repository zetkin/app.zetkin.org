import { FormattedDate } from 'react-intl';

import { ZetkinEvent } from '../types/zetkin';

interface MonthCalendarProps {
    month?: number;
    year?: number;
    events: ZetkinEvent[];
}

const MonthCalendar = ({ month, events, year }: MonthCalendarProps): JSX.Element => {

    if (!month) month = new Date(Date.now()).getMonth();
    if (!year) year = new Date(Date.now()).getFullYear();

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
        <div data-testid="calendar-wrapper" style={{
            display: 'grid',
            gap: '0.5rem',
            gridTemplateColumns: 'repeat(7, minmax(125px, 1fr))',
            gridTemplateRows: `repeat(${calendarRows}, minmax(125px, 1fr))`,
            height: '100%',
            overflow: 'scroll',
        }}>
            { Array.from(Array(calendarRows * 7).keys()).map((_, index) => {
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
    );
};

export default MonthCalendar;