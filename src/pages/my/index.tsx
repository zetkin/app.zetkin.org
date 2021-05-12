import { GetServerSideProps } from 'next';
import { Heading } from '@adobe/react-spectrum';
import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';

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

    return (
        <>
            <Heading level={ 1 }>
                <Msg id="pages.my.welcome" values={{ userName: user.first_name }}/>
            </Heading>
            <EventList
                bookedEvents={ bookedEventsQuery.data }
                eventResponses={ eventResponses }
                events={ userEventsQuery.data }
                onSignup={ onSignup }
                onUndoSignup={ onUndoSignup }
            />
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
