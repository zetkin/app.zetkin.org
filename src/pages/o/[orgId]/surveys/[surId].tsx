import { dehydrate } from 'react-query/hydration';
import { GetServerSideProps } from 'next';
import { QueryClient, useQuery } from 'react-query';

import getOrg from '../../../../fetching/getOrg';
import getSurvey from '../../../../fetching/getSurvey';

export const getServerSideProps : GetServerSideProps = async (context) => {
    const queryClient = new QueryClient();
    const { surId, orgId } = context.params;

    await queryClient.prefetchQuery(['survey', surId], getSurvey(orgId as string, surId as string));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));

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
    surId: string;
    orgId: string
};

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