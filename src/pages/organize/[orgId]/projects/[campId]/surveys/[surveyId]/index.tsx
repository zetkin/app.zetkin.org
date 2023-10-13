import BackendApiClient from 'core/api/client/BackendApiClient';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Box, Grid } from '@mui/material';

import EmptyOverview from 'features/surveys/components/EmptyOverview';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SubmissionChartCard from 'features/surveys/components/SubmissionChartCard';
import SurveyDataModel from 'features/surveys/models/SurveyDataModel';
import SurveyLayout from 'features/surveys/layout/SurveyLayout';
import SurveyUnlinkedCard from 'features/surveys/components/SurveyUnlinkedCard';
import SurveyURLCard from 'features/surveys/components/SurveyURLCard';
import useModel from 'core/useModel';
import useServerSide from 'core/useServerSide';
import useSurvey from 'features/surveys/hooks/useSurvey';
import { ZetkinSurvey } from 'utils/types/zetkin';
import useSurveyState, {
  SurveyState,
} from 'features/surveys/hooks/useSurveyState';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, surveyId } = ctx.params!;
    try {
      const client = new BackendApiClient(ctx.req.headers);
      const data = await client.get<ZetkinSurvey>(
        `/api/orgs/${orgId}/surveys/${surveyId}`
      );
      const actualCampaign = data.campaign?.id.toString() ?? 'standalone';
      if (actualCampaign !== campId) {
        return { notFound: true };
      }
    } catch (error) {
      return { notFound: true };
    }

    return {
      props: {
        campId,
        orgId,
        surveyId,
      },
    };
  },
  {
    authLevelRequired: 2,
    localeScope: ['layout.organize.surveys', 'pages.organizeSurvey'],
  }
);

interface SurveyPageProps {
  campId: string;
  orgId: string;
  surveyId: string;
}

const SurveyPage: PageWithLayout<SurveyPageProps> = ({
  campId,
  orgId,
  surveyId,
}) => {
  const model = useModel(
    (env) => new SurveyDataModel(env, parseInt(orgId), parseInt(surveyId))
  );
  const onServer = useServerSide();
  const { data: survey } = useSurvey(parseInt(orgId), parseInt(surveyId));
  const state = useSurveyState(parseInt(orgId), parseInt(surveyId));
  const campaignId = isNaN(parseInt(campId)) ? 'standalone' : parseInt(campId);

  if (onServer) {
    return null;
  }

  const isOpen = state === SurveyState.PUBLISHED;

  if (!survey) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{survey?.title}</title>
      </Head>
      <Box>
        {model.surveyIsEmpty ? (
          <EmptyOverview campId={campId} orgId={orgId} surveyId={surveyId} />
        ) : (
          <Grid container spacing={2}>
            <Grid item md={8}>
              <SubmissionChartCard
                orgId={parseInt(orgId)}
                surveyId={parseInt(surveyId)}
              />
            </Grid>
            <Grid item md={4}>
              <SurveyURLCard
                isOpen={isOpen}
                orgId={orgId}
                surveyId={surveyId}
              />
              <SurveyUnlinkedCard
                campId={campaignId}
                orgId={parseInt(orgId)}
                surveyId={parseInt(surveyId)}
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  );
};

SurveyPage.getLayout = function getLayout(page, props) {
  return (
    <SurveyLayout
      campaignId={props.campId}
      orgId={props.orgId}
      surveyId={props.surveyId}
    >
      {page}
    </SurveyLayout>
  );
};

export default SurveyPage;
