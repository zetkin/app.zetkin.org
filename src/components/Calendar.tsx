import { FormattedDate } from 'react-intl';
import { ZetkinEvent } from '../types/zetkin';
import { Heading, Text } from '@adobe/react-spectrum';
import { useEffect, useRef } from 'react';

interface CalendarProps {
    focusDate?: Date;
    events: ZetkinEvent[];
}

const Calendar = ({ focusDate = new Date(Date.now()), events }: CalendarProps): JSX.Element => {
    const calendar = useRef<HTMLDivElement>(null);
    const calendarWrapper = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const height = calendar.current?.clientHeight || 0;
        const y = height / 24 * 8; // approx 8am
        calendarWrapper.current?.scrollTo(0, y);
    }, []);

    const monday = new Date(new Date(focusDate)
        .setDate(focusDate.getDate() - focusDate.getDay() + 1));
    const nextMonday = new Date(new Date(monday)
        .setDate(monday.getDate() + 7));

    const eventsOfTheWeek = events.filter(event => {
        return new Date(event.start_time) > monday &&
            new Date(event.start_time) < nextMonday ||
            new Date(event.end_time) > monday &&
            new Date(event.end_time) < nextMonday;
    });

    const getEventsOfTheDay = (day: number) => {
        if (day === 7) day = 0; // sunday has index 0 in the Date object
        return eventsOfTheWeek.filter(event => (
            new Date(event.start_time).getDay() === day ||
            new Date(event.end_time).getDay() === day));
    };

    const getEventPos = (start: string, end: string) => {
        const oneMinute = 100 / 1440;
        const startTime = new Date(start);
        const endTime = new Date(end);
        const startFromMidnight = (startTime.getTime() - startTime.setHours(0, 0, 0, 0)) / 60000;
        const endFromMidnight = (endTime.getTime() - endTime.setHours(0, 0, 0, 0)) / 60000;
        const diff = endFromMidnight - startFromMidnight;

        return {
            height: `${diff * oneMinute}%`,
            top: `${startFromMidnight * oneMinute}%`,
        };
    };

    return (
        <div ref={ calendarWrapper } data-testid="calendar-wrapper" style={{
            height: '100%',
            overflow: 'scroll',
            width: '100%',
        }}>
            <div style={{
                background: 'rgb(234, 234, 234)',
                display:'flex',
                gap:'1rem',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                width: '100%',
                zIndex: 1,

            }}>
                { Array.from(Array(7).keys()).map((_, index) => (
                    <div key={ index } data-testid="weekdays" style={{
                        alignItems: 'center',
                        display:'flex',
                        flexDirection: 'column',
                        gap:'1rem',
                        height: '100%',
                        justifyContent: 'start',
                        width: '100%',
                    }}>
                        <Heading data-testid={ `weekday-${index}` } level={ 3 }>
                            <FormattedDate
                                value={ new Date(new Date(monday).setDate(monday.getDate() + index)) }
                                weekday="short"
                            />
                        </Heading>
                        <Text data-testid={ `date-${index}` }>
                            <FormattedDate
                                day="2-digit"
                                value={ new Date(new Date(monday).setDate(monday.getDate() + index)) }
                            />
                        </Text>
                    </div>
                )) }
            </div>
            <div ref={ calendar } style={{
                alignItems: 'center',
                display:'flex',
                gap:'0.5rem',
                height: '100rem',
                justifyContent: 'start',
                width: '100%',
            }}>
                { Array.from(Array(7).keys()).map((_, index) => (
                    <div key={ index } style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        height: '100%',
                        justifyContent: 'space-between',
                        padding: '0',
                        width: '100%',
                    }}>
                        <ul data-testid={ `day-${index}-events` } style={{
                            background:'lightgray',
                            height: '100%',
                            listStyle: 'none',
                            margin: 0,
                            padding:0 ,
                            position: 'relative',
                            width: '100%',
                        }}>
                            { getEventsOfTheDay(index + 1)?.map(event => (
                                <li key={ event.id } data-testid={ `event-${event.id}` } style={{
                                    background: 'gray',
                                    height: getEventPos(event.start_time, event.end_time).height,
                                    margin: '1rem 0',
                                    padding: '1rem',
                                    position: 'absolute',
                                    top: getEventPos(event.start_time, event.end_time).top,
                                    width: '100%',
                                }}>
                                    { `event with id ${event.id}` }
                                </li>
                            )) }
                        </ul>
                    </div>
                )) }
            </div>
        </div>
    );
};

export default Calendar;
