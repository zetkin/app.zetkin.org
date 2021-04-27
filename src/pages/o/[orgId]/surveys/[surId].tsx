import { GetServerSideProps } from 'next';
import { useQuery } from 'react-query';

import DefaultOrgLayout from '../../../../components/layout/DefaultOrgLayout';
import getOrg from '../../../../fetching/getOrg';
import getSurvey from '../../../../fetching/getSurvey';
import { PageWithLayout } from '../../../../types';
import { scaffold } from '../../../../utils/next';

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { surId, orgId } = context.params!;

    await context.queryClient.prefetchQuery(['survey', surId], getSurvey(orgId as string, surId as string));
    await context.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));

    const surveyState = context.queryClient.getQueryState(['survey', surId]);
    const orgState = context.queryClient.getQueryState(['org', orgId]);

    if (surveyState?.status === 'success' && orgState?.status === 'success') {
        return {
            props: {
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

type SurveyPageProps = {
    orgId: string;
    surId: string;
};

const SurveyPage : PageWithLayout<SurveyPageProps> = (props) => {
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

SurveyPage.getLayout = function getLayout(page, props) {
    return (
        <DefaultOrgLayout orgId={ props.orgId as string }>
            { page }
        </DefaultOrgLayout>
    );
};

export default SurveyPage;