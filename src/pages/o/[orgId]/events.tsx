import DefaultLayout from '../../../layout/DefaultLayout';
import { GetServerSideProps } from 'next';
import OrgLayout from '../../../layout/OrgLayout';
import { dehydrate } from 'react-query/hydration';
import getEvents from '../../../fetching/getEvents';
import getOrg from '../../../fetching/getOrg';
import { QueryClient, useQuery } from 'react-query';

export const getServerSideProps : GetServerSideProps = async (context) => {
    const queryClient = new QueryClient();
    const { orgId } = context.params;

    await queryClient.prefetchQuery('events', getEvents(orgId as string));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));

    const eventsState = queryClient.getQueryState('events');
    const orgState = queryClient.getQueryState(['org', orgId]);

    if (eventsState.status === 'success' && orgState.status === 'success') {
        return {
            props: {
                dehydratedState: dehydrate(queryClient),
                orgId
            },
        };
    }
    else {
        return {
            notFound: true,
        };
    }
};

type OrgEventsPageProps = {
    orgId: string,
}

export default function OrgEventsPage(props : OrgEventsPageProps) : JSX.Element {
    const { orgId } = props;
    const eventsQuery = useQuery('events', getEvents(orgId));

    return (
        <>
            <ul>
                { eventsQuery.data.map((e) => (
                    <li key={ e.id }>{ e.title }</li>
                )) }
            </ul>
        </>
    );
}

OrgEventsPage.getLayout = function getLayout(page, props) {
    return (
        <DefaultLayout>
            <OrgLayout orgId={ props.orgId }>
                { page }
            </OrgLayout>
        </DefaultLayout>
    );
};