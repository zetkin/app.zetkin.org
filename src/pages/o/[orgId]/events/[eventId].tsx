import { GetServerSideProps } from 'next';
import { dehydrate } from 'react-query/hydration';
import getEvent from '../../../../fetching/getEvent';
import getOrg from '../../../../fetching/getOrg';
import { QueryClient, useQuery } from 'react-query';

export const getServerSideProps : GetServerSideProps = async (context) => {
    const queryClient = new QueryClient();
    const { orgId, eventId } = context.params;

    await queryClient.prefetchQuery(['event', eventId], getEvent(orgId as string, eventId as string));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));

    const eventState = queryClient.getQueryState(['event', eventId]);
    const orgState = queryClient.getQueryState(['org', orgId]);

    if (eventState.status === 'success' && orgState.status === 'success') {
        return {
            props: {
                dehydratedState: dehydrate(queryClient),
                eventId,
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

type OrgEventPageProps = {
    eventId: string,
    orgId: string,
}

export default function OrgEventPage(props : OrgEventPageProps) : JSX.Element {
    const { orgId, eventId } = props;
    const eventQuery = useQuery(['event', eventId], getEvent(orgId, eventId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <>
            <h1>{ orgQuery.data.title }</h1>
            <h1>{ eventQuery.data.title }</h1>
        </>
    );
}