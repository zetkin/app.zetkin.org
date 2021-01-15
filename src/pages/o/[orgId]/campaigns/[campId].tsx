import { GetServerSideProps } from 'next';
import { dehydrate } from 'react-query/hydration';
import { QueryClient, useQuery } from 'react-query';

function getCampaign(orgId, campId) {
    return async () => {
        const cIdRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/campaigns/${campId}`);
        const cIdData = await cIdRes.json();
        return cIdData.data;
    };
}

function getOrg(orgId) {
    return async () => {
        const oRes = await fetch(`http://localhost:3000/api/orgs/${orgId}`);
        const oData = await oRes.json();
        return oData.data;
    };
}

export const getServerSideProps : GetServerSideProps = async (context) => {
    const queryClient = new QueryClient();
    const { campId, orgId } = context.params;

    await queryClient.prefetchQuery(['campaign', campId], getCampaign(orgId, campId));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId));

    const campaignState = queryClient.getQueryState(['campaign', campId]);
    const orgState = queryClient.getQueryState(['org', orgId]);

    if (campaignState.status === 'success' && orgState.status === 'success') {
        return {
            props: {
                campId,
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

type OrgCampaignPageProps = {
    campId: string,
    orgId: string,
}

export default function OrgCampaignPage(props : OrgCampaignPageProps) : JSX.Element {
    const { campId, orgId } = props;
    const campaignQuery = useQuery(['campaign', campId], getCampaign(orgId, campId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <>
            <h1>{ orgQuery.data.title }</h1>
            <h1>{ campaignQuery.data.title }</h1>
        </>
    );
}