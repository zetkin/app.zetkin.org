import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';
import Head from 'next/head';

import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SubmissionWarningAlert from 'features/surveys/components/SubmissionWarningAlert';
import SurveyDataModel from 'features/surveys/models/SurveyDataModel';
import SurveyLayout from 'features/surveys/layout/SurveyLayout';
import SurveySubmissionsList from 'features/surveys/components/SurveySubmissionsList';
import SurveySubmissionsModel from 'features/surveys/models/SurveySubmissionsModel';
import SurveySuborgsCard from 'features/surveys/components/SurveySuborgsCard';
import useModel from 'core/useModel';
import ZUIFuture from 'zui/ZUIFuture';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, surveyId } = ctx.params!;
    const filter = ctx.query.filter ? true : false;

    return {
      props: {
        campId,
        orgId,
        showUnlinkedOnly: filter,
        surveyId,
      },
    };
  },
  {
    authLevelRequired: 2,
    localeScope: ['layout.organize.surveys', 'pages.organizeSurvey'],
  }
);

interface SubmissionsPageProps {
  campId: string;
  showUnlinkedOnly: boolean;
  orgId: string;
  surveyId: string;
}

const SubmissionsPage: PageWithLayout<SubmissionsPageProps> = ({
  campId,
  showUnlinkedOnly,
  orgId,
  surveyId,
}) => {
  const model = useModel(
    (env) => new SurveyDataModel(env, parseInt(orgId), parseInt(surveyId))
  );
  const subsModel = useModel(
    (env) =>
      new SurveySubmissionsModel(env, parseInt(orgId), parseInt(surveyId))
  );

  const campaignId = isNaN(parseInt(campId)) ? 'standalone' : parseInt(campId);

  return (
    <>
      <Head>
        <title>{model.getData().data?.title}</title>
      </Head>
      <Grid container spacing={2}>
        <Grid item md={8} sm={12} xs={12}>
          <ZUIFuture future={subsModel.getSubmissions()}>
            {(data) => {
              let submissions = data;
              if (showUnlinkedOnly) {
                submissions = data.filter(
                  (sub) => sub.respondent && !sub.respondent.id
                );
              }
              return <SurveySubmissionsList submissions={submissions} />;
            }}
          </ZUIFuture>
        </Grid>
        <Grid item md={4} sm={12} xs={12}>
          <SubmissionWarningAlert
            campId={campaignId}
            orgId={parseInt(orgId)}
            showUnlinkedOnly={showUnlinkedOnly}
            surveyId={parseInt(surveyId)}
          />

          <SurveySuborgsCard
            orgId={parseInt(orgId)}
            surveyId={parseInt(surveyId)}
          />
        </Grid>
      </Grid>
    </>
  );
};

SubmissionsPage.getLayout = function getLayout(page, props) {
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

export default SubmissionsPage;
