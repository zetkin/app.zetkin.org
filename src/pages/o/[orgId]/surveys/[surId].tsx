import { dehydrate } from 'react-query/hydration';
import { GetServerSideProps } from 'next';
import { QueryClient, useQuery } from 'react-query';

import getOrg from '../../../../fetching/getOrg';
import getSurvey from '../../../../fetching/getSurvey';
import OrgLayout from '../../../../components/layout/OrgLayout';
import { PageWithLayout } from '../../../../types';
import { scaffold } from '../../../../utils/next';

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    const queryClient = new QueryClient();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { surId, orgId } = context.params!;

    await queryClient.prefetchQuery(['survey', surId], getSurvey(orgId as string, surId as string));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));

    const surveyState = queryClient.getQueryState(['survey', surId]);
    const orgState = queryClient.getQueryState(['org', orgId]);

    if (surveyState?.status === 'success' && orgState?.status === 'success') {
        return {
            props: {
                dehydratedState: dehydrate(queryClient),
                orgId,
                surId,
            },
        };
    }
    else {
        return {
            notFound: true,
        };
    }
});

type OrgSurveyPageProps = {
    surId: string;
    orgId: string;
};

const OrgSurveyPage : PageWithLayout<OrgSurveyPageProps> = (props) => {
    const { surId, orgId } = props;
    const surveyQuery = useQuery(['survey', surId], getSurvey(orgId, surId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <>
            <h1>{ orgQuery.data?.title }</h1>
            <h1>{ surveyQuery.data?.title }</h1>
        </>
    );
};

OrgSurveyPage.getLayout = function getLayout(page, props) {
    return (
        <OrgLayout mainPage={ false } orgId={ props.orgId as string }>
            { page }
        </OrgLayout>
    );
};

export default OrgSurveyPage;