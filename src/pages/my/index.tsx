import { GetServerSideProps } from 'next';
import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { Content, Heading, Text } from '@adobe/react-spectrum';
import { Item, Tabs } from '@react-spectrum/tabs';

import EventList from '../../components/EventList';
import getBookedEvents from '../../fetching/getBookedEvents';
import getEventResponses from '../../fetching/getEventResponses';
import getUserEvents from '../../fetching/getUserEvents';
import MyHomeLayout from '../../components/layout/MyHomeLayout';
import { PageWithLayout } from '../../types';
import { scaffold } from '../../utils/next';
import { useEventResponses } from '../../hooks';
import { ZetkinUser } from '../../types/zetkin';

const scaffoldOptions = {
    authLevelRequired: 1,
    localeScope: [
        'layout.my',
        'misc.eventList',
        'misc.publicHeader',
        'pages.my',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    const { user } = context;

    if (user) {
        await context.queryClient.prefetchQuery('userEvents', getUserEvents(context.apiFetch));
        await context.queryClient.prefetchQuery('bookedEvents', getBookedEvents(context.apiFetch));
        await context.queryClient.prefetchQuery('eventResponses', getEventResponses(context.apiFetch));

        return {
            props: {},
        };
    }
    else {
        return {
            notFound: true,
        };
    }
}, scaffoldOptions);

interface MyPageProps {
    user: ZetkinUser;
}

const MyPage : PageWithLayout<MyPageProps> = (props) => {
    const { user } = props;

    const userEventsQuery = useQuery('userEvents', getUserEvents());
    const bookedEventsQuery = useQuery('bookedEvents', getBookedEvents());

    const { eventResponses, onSignup, onUndoSignup } = useEventResponses();
    const userEvents = userEventsQuery.data;

    if (!userEvents || userEvents.length === 0) {
        return (
            <>
                <Heading level={ 1 }>
                    <Msg id="pages.my.welcome" values={{ userName: user.first_name }}/>
                </Heading>
                <Text>
                    <Msg id="pages.my.placeholder"/>
                </Text>
            </>
        );
    }

    const today = <Msg id="pages.my.tabs.today"/>;
    const tomorrow = <Msg id="pages.my.tabs.tomorrow"/>;
    const week = <Msg id="pages.my.tabs.thisWeek"/>;
    const later = <Msg id="pages.my.tabs.later"/>;

    return (
        <>
            <Heading level={ 1 }>
                <Msg id="pages.my.welcome" values={{ userName: user.first_name }}/>
            </Heading>
            <Tabs
                aria-label="Options for events time filtering"
                defaultSelectedKey="today">
                <Item key="today" title={ today }>
                    <Content>
                        <EventList
                            bookedEvents={ bookedEventsQuery.data }
                            eventResponses={ eventResponses }
                            events={ userEvents }
                            onSignup={ onSignup }
                            onUndoSignup={ onUndoSignup }
                        />
                    </Content>
                </Item>
                <Item key="tomorrow" title={ tomorrow }>
                    <Content>
                        <EventList
                            bookedEvents={ bookedEventsQuery.data }
                            eventResponses={ eventResponses }
                            events={ userEvents }
                            onSignup={ onSignup }
                            onUndoSignup={ onUndoSignup }
                        />
                    </Content>
                </Item>
                <Item key="week" title={ week }>
                    <Content>
                        <EventList
                            bookedEvents={ bookedEventsQuery.data }
                            eventResponses={ eventResponses }
                            events={ userEvents }
                            onSignup={ onSignup }
                            onUndoSignup={ onUndoSignup }
                        />
                    </Content>
                </Item>
                <Item key="later" title={ later }>
                    <Content>
                        <EventList
                            bookedEvents={ bookedEventsQuery.data }
                            eventResponses={ eventResponses }
                            events={ userEvents }
                            onSignup={ onSignup }
                            onUndoSignup={ onUndoSignup }
                        />
                    </Content>
                </Item>
            </Tabs>
        </>
    );
};

MyPage.getLayout = function getLayout(page) {
    return (
        <MyHomeLayout>
            { page }
        </MyHomeLayout>
    );
};

export default MyPage;
