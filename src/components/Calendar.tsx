import { ZetkinEvent } from '../types/zetkin';
import { ActionButton, Flex, View } from '@adobe/react-spectrum';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';
import { Heading, Text } from '@adobe/react-spectrum';
import { useEffect, useRef } from 'react';


interface CalendarProps {
    thisMonday: Date;
    events: ZetkinEvent[];
    setSelectedDate: (offset:number) => void;
}

const WeekCalendar = ({ thisMonday: focusMonday, events, setSelectedDate }: CalendarProps): JSX.Element => {
    const calendar = useRef<HTMLDivElement>(null);
    const calendarWrapper = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const height = calendar.current?.clientHeight || 0;
        const y = height / 24 * 7; // approx 7am
        calendarWrapper.current?.scrollTo(0, y);
    }, []);

    const nextMonday = new Date(new Date(focusMonday)
        .setDate(focusMonday.getDate() + 7));

    const eventsOfTheWeek = events.filter(event => {
        return new Date(event.start_time) >= focusMonday &&
            new Date(event.start_time) < nextMonday ||
            new Date(event.end_time) > focusMonday &&
            new Date(event.end_time) <= nextMonday;
    });

    const getEventsOfTheDay = (day: number) => {
        if (day === 7) day = 0; // sunday has index 0 in the Date object
        return eventsOfTheWeek.filter(event => (
            new Date(event.start_time).getUTCDay() === day ||
            new Date(event.end_time).getUTCDay() === day));
    };

    const getEventPos = (start: string, end: string) => {
        const oneMinute = 100 / 1440;
        const startTime = new Date(start);
        const endTime = new Date(end);
        const startFromMidnight = (startTime.getTime() - startTime.setUTCHours(0, 0, 0, 0)) / 60000;
        const endFromMidnight = (endTime.getTime() - endTime.setUTCHours(0, 0, 0, 0)) / 60000;
        const diff = endFromMidnight - startFromMidnight;

        return {
            height: `${diff * oneMinute}%`,
            top: `${startFromMidnight * oneMinute}%`,
        };
    };

    return (
        <>
            <View position="absolute" right="15rem" top="-2.6rem">
                <Flex alignItems="center">
                    <ActionButton onPress={ () => setSelectedDate(-7) }>
                        <Msg id="misc.calendar.prev" />
                    </ActionButton>
                    <View padding="size-100">
                        <FormattedDate
                            day="2-digit"
                            month="short"
                            value={ focusMonday }
                        />
                    </View>
                    <ActionButton onPress={ () => setSelectedDate(7) }>
                        <Msg id="misc.calendar.next" />
                    </ActionButton>
                </Flex>
            </View>
            <div ref={ calendarWrapper } data-testid="calendar-wrapper" style={{
                height: '100%',
                overflow: 'scroll',
                width: '100%',
            }}>
                <div style={{
                    background: '#f5f5f5',
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
                                    value={ new Date(new Date(focusMonday).setDate(focusMonday.getDate() + index)) }
                                    weekday="short"
                                />
                            </Heading>
                            <Text data-testid={ `date-${index}` }>
                                <FormattedDate
                                    day="2-digit"
                                    value={ new Date(new Date(focusMonday).setDate(focusMonday.getDate() + index)) }
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
        </>
    );
};

export default WeekCalendar;
