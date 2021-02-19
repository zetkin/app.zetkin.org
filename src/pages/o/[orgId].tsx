import { dehydrate } from 'react-query/hydration';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { QueryClient, useQuery } from 'react-query';

import getOrg from '../../fetching/getOrg';

export const getServerSideProps : GetServerSideProps = async (context) => {
    const queryClient = new QueryClient();
    const { orgId } = context.params;

    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));

    const orgState = queryClient.getQueryState(['org', orgId]);

    if (orgState.status === 'success') {
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

type OrgPageProps = {
    orgId: string
};

export default function OrgPage(props : OrgPageProps) : JSX.Element {
    const { orgId } = props;
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return ( 
        <>
            <h1>{ orgQuery.data.title }</h1>
            <ul>
                <li><Link href={ `/o/${orgId}/campaigns` }>Campaigns</Link></li>
                <li><Link href={ `/o/${orgId}/events` }>Events</Link></li>
            </ul>
        </>
    );
}