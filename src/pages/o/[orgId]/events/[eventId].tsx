import { GetServerSideProps } from 'next';
import { Link } from '@adobe/react-spectrum';
import NextLink from 'next/link';
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
            <h1 data-test='event-title'>
                { eventQuery.data.title ? eventQuery.data.title : eventQuery.data.activity.title }
            </h1>
            <Link>
                <NextLink href={ `/o/${orgId}` }>
                    <a>{ orgQuery.data.title }</a>
                </NextLink>
            </Link>
            <Link>
                <NextLink href={ `/o/${orgId}/campaigns/${eventQuery.data.campaign.id}` }>
                    <a>{ eventQuery.data.campaign.title }</a>
                </NextLink>
            </Link>
            <p data-test='start-time'>{ eventQuery.data.start_time }</p>
            <p data-test='end-time'>{ eventQuery.data.end_time }</p>
            <p data-test='info-text'>{ eventQuery.data.info_text }</p>
            <p data-test='location'>{ eventQuery.data.location.title }</p>
        </>
    );
}