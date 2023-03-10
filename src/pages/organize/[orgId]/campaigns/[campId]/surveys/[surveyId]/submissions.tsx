import { GetServerSideProps } from 'next';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SubmissionWarningCard from 'features/surveys/components/SubmissionWarningCard';
import SurveyLayout from 'features/surveys/layout/SurveyLayout';
import SurveySubmissionsList from 'features/surveys/components/SurveySubmissionsList';
import SurveySubmissionsModel from 'features/surveys/models/SurveySubmissionsModel';
import useModel from 'core/useModel';
import ZUIFuture from 'zui/ZUIFuture';
import { Grid, useMediaQuery, useTheme } from '@mui/material';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Grid container direction={isMobile ? 'column' : 'row'}>
      <Grid item md={8}>
        <ZUIFuture future={subsModel.getSubmissions()}>
          {(data) => {
            return <SurveySubmissionsList submissions={data} />;
          }}
        </ZUIFuture>
      </Grid>
      <Grid item md={4}>
        <SubmissionWarningCard
          orgId={parseInt(orgId)}
          surveyId={parseInt(surveyId)}
        />
      </Grid>
    </Grid>
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
