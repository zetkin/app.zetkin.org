import { GetServerSideProps } from 'next';
import { dehydrate } from 'react-query/hydration';
import { QueryClient, useQuery } from 'react-query';

function getSurvey(orgId, surId) {
    return async () => {
        try {
            const sIdRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/surveys/${surId}`);
            const sIdData = await sIdRes.json();

            return sIdData.data;
        }
        catch (err) {
            if (err.name != 'FetchError') {
                throw err;
            }
            return null;
        }
    };
}

function getOrg(orgId) {
    return async () => {
        try {
            const oRes = await fetch(`http://localhost:3000/api/orgs/${orgId}`);
            const oData = await oRes.json();

            return oData.data;
        }
        catch (err) {
            if (err.name != 'FetchError') {
                throw err;
            }
            return null;
        }
    };
}

export const getServerSideProps : GetServerSideProps = async (context) => {
    const queryClient = new QueryClient();
    const { surId, orgId } = context.params;

    await queryClient.prefetchQuery(['survey', surId], getSurvey(orgId, surId));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId));

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            orgId,
            surId
        },
    };
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