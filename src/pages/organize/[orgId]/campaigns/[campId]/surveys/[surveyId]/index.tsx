import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Box, Grid } from '@mui/material';

import EmptyOverview from 'features/surveys/components/EmptyOverview';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SubmissionChartCard from 'features/surveys/components/SubmissionChartCard';
import SurveyLayout from 'features/surveys/layout/SurveyLayout';
import SurveyUnlinkedCard from 'features/surveys/components/SurveyUnlinkedCard';
import SurveyURLCard from 'features/surveys/components/SurveyURLCard';
import useModel from 'core/useModel';
import useServerSide from 'core/useServerSide';
import SurveyDataModel, {
  SurveyState,
} from 'features/surveys/models/SurveyDataModel';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, surveyId } = ctx.params!;

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
  const campaignId = isNaN(parseInt(campId)) ? 'standalone' : parseInt(campId);

  if (onServer) {
    return null;
  }

  const { data: survey } = model.getData();
  const isOpen = model.state === SurveyState.PUBLISHED;

  if (!survey) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{model.getData().data?.title}</title>
      </Head>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="center"
        paddingTop={8}
      >
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
