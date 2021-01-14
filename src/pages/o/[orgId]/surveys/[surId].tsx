import { GetServerSideProps } from 'next';
import { dehydrate } from 'react-query/hydration';
import { QueryClient, useQuery } from 'react-query';

function getSurvey(orgId, surId) {
    return async () => {
        const sIdRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/surveys/${surId}`);
        const sIdData = await sIdRes.json();
        if (sIdData) {
            return sIdData.data;
        }
        throw 'not found';
    };
}

function getOrg(orgId) {
    return async () => {
        const oRes = await fetch(`http://localhost:3000/api/orgs/${orgId}`);
        const oData = await oRes.json();
        if (oData.data) {
            return oData.data;
        }
        throw 'not found';
    };
}

export const getServerSideProps : GetServerSideProps = async (context) => {
    const queryClient = new QueryClient();
    const { surId, orgId } = context.params;

    await queryClient.prefetchQuery(['survey', surId], getSurvey(orgId, surId));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId));

    const surveyState = queryClient.getQueryState(['survey', surId]);
    const orgState = queryClient.getQueryState(['org', orgId]);

    if (surveyState.status === 'success' && orgState.status === 'success') {
        return {
            props: {
                dehydratedState: dehydrate(queryClient),
                orgId,
                surId
            },
        };
    }
    else {
        return {
            notFound: true,
        };
    }
};

type OrgSurveyPageProps = {
    surId: string,
    orgId: string,
}

export default function OrgSurveyPage(props : OrgSurveyPageProps) : JSX.Element {
    const { surId, orgId } = props;
    const surveyQuery = useQuery(['survey', surId], getSurvey(orgId, surId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <>
            <h1>{ orgQuery.data.title }</h1>
            <h1>{ surveyQuery.data.title }</h1>
        </>
    );
}