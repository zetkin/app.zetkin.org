import { FormattedMessage as Msg } from 'react-intl';
import { Flex, Heading, Text, View } from '@adobe/react-spectrum';

import { ZetkinEvent } from '../types/zetkin';

interface CalendarProps {
    focusDate?: Date;
    events: ZetkinEvent[];
}

const Calendar = ({ focusDate = new Date(Date.now()), events }: CalendarProps): JSX.Element => {
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
            <Flex gap="size-100" height="100%" justifyContent="space-between" width="100%">
                { week.map((day, index) => (
                    <Flex key={ day } alignItems="center" direction="column" justifyContent="start" minHeight="100%" width="100%">
                        <Heading level={ 3 }>
                            <Msg id={ day }/>
                        </Heading>
                        <Text data-testid={ day }>
                            { new Date(new Date(monday).setDate(monday.getDate() + index)).getDate() }
                        </Text>
                        <View backgroundColor="gray-100" flexGrow={ 1 } height="100%" margin="size-100" padding="size-100" width="100%">
                            <ul data-testid={ `${day}-events` } style={{ minHeight: '100%' }}>
                                { getEventsOfTheDay(index + 1)?.map(event => (
                                    <li key={ event.id }>
                                        { `event with id ${event.id}` }
                                    </li>
                                )) }
                            </ul>
                        </View>
                    </Flex>
                )) }
            </Flex>
            <style jsx>{ `
                ul {
                    list-style: none;
                    padding: 0;
                }
                li {
                    background-color: lightgray;
                    padding: 1rem;
                    margin: 1rem 0;
                }
                ` }
            </style>
        </>
    );
};

export default Calendar;
