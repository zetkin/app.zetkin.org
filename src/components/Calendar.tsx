import { FormattedMessage as Msg } from 'react-intl';
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

    const week = [
        'misc.calendar.weeks.mon', 'misc.calendar.weeks.tue',
        'misc.calendar.weeks.wed', 'misc.calendar.weeks.thu',
        'misc.calendar.weeks.fri', 'misc.calendar.weeks.sat',
        'misc.calendar.weeks.sun',
    ];
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

    return (
        <>
            <div ref={ calendarWrapper } style={{
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
                    { week.map((day, index) => (
                        <div key={ day } style={{
                            alignItems: 'center',
                            display:'flex',
                            flexDirection: 'column',
                            gap:'1rem',
                            height: '100%',
                            justifyContent: 'start',
                            width: '100%',
                        }}>
                            <Heading level={ 3 }>
                                <Msg id={ day }/>
                            </Heading>
                            <Text data-testid={ day }>
                                { new Date(new Date(monday).setDate(monday.getDate() + index)).getDate() }
                            </Text>
                        </div>
                    )) }
                </div>
                <div ref={ calendar } style={{
                    alignItems: 'center',
                    display:'flex',
                    gap:'0.5rem',
                    height: '200vh',
                    justifyContent: 'start',
                    width: '100%',
                }}>
                    { week.map((day, index) => (
                        <div key={ day } style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            height: '100%',
                            justifyContent: 'space-between',
                            padding: '0',
                            width: '100%',
                        }}>
                            <ul data-testid={ `${day}-events` } style={{
                                background:'lightgray',
                                height: '100%',
                                listStyle: 'none',
                                margin: 0,
                                padding:0 ,
                                position: 'relative',
                                width: '100%',
                            }}>
                                { getEventsOfTheDay(index + 1)?.map(event => (
                                    <CalendarEvent
                                        key={ event.id }
                                        endTime={ event.end_time }
                                        id={ event.id }
                                        startTime={ event.start_time }
                                    />
                                )) }
                            </ul>
                        </div>
                    )) }
                </div>
            </div>
        </>
    );
};

interface CalendarEventProps {
    startTime: string;
    endTime: string;
    id: number;
}

const CalendarEvent = ({ startTime, endTime, id }: CalendarEventProps): JSX.Element => {

    const getPos = (start: string, end: string) => {
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
        <>
            <li style={{
                background: 'gray',
                height: getPos(startTime, endTime).height,
                margin: '1rem 0',
                padding:'1rem',
                position: 'absolute',
                top: getPos(startTime, endTime).top,
                width: '100%',
            }}>
                { `event with id ${id}` }
            </li>
        </>
    );
};

export default Calendar;
