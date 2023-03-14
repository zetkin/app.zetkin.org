import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SurveyLayout from 'features/surveys/layout/SurveyLayout';
import SurveySubmissionsList from 'features/surveys/components/SurveySubmissionsList';
import SurveySubmissionsModel from 'features/surveys/models/SurveySubmissionsModel';
import SurveySuborgsCard from 'features/surveys/components/SurveySuborgsCard';
import useModel from 'core/useModel';
import ZUIFuture from 'zui/ZUIFuture';

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

interface SubmissionsPageProps {
  campId: string;
  orgId: string;
  surveyId: string;
}

const SubmissionsPage: PageWithLayout<SubmissionsPageProps> = ({
  orgId,
  surveyId,
}) => {
  const subsModel = useModel(
    (env) =>
      new SurveySubmissionsModel(env, parseInt(orgId), parseInt(surveyId))
  );

  return (
    <ZUIFuture future={subsModel.getSubmissions()}>
      {(data) => {
        return (
          <Grid container spacing={2}>
            <Grid item md={8} sm={12} xs={12}>
              <SurveySubmissionsList submissions={data} />
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <SurveySuborgsCard
                orgId={parseInt(orgId)}
                surveyId={parseInt(surveyId)}
              />
            </Grid>
          </Grid>
        );
      }}
    </ZUIFuture>
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
