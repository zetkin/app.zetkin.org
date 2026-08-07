import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { getSurveyProjectId } from 'features/surveys/utils/getSurveyUrl';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SubmissionWarningAlert from 'features/surveys/components/SubmissionWarningAlert';
import SurveyLayout from 'features/surveys/layouts/SurveyLayout';
import SurveySubmissionsList from 'features/surveys/components/SurveySubmissionsList';
import SurveySuborgsCard from 'features/surveys/components/SurveySuborgsCard';
import useSurvey from 'features/surveys/hooks/useSurvey';
import useSurveySubmissions from 'features/surveys/hooks/useSurveySubmissions';
import ZUIFuture from 'zui/ZUIFuture';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { projectId, orgId, surveyId } = ctx.params!;
    const filter = ctx.query.filter ? true : false;

    return {
      props: {
        orgId,
        projectId,
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
  projectId: string;
  showUnlinkedOnly: boolean;
  orgId: string;
  surveyId: string;
}

const SubmissionsPage: PageWithLayout<SubmissionsPageProps> = ({
  projectId: projId,
  showUnlinkedOnly,
  orgId,
  surveyId,
}) => {
  const parsedOrg = parseInt(orgId);
  const surveyFuture = useSurvey(parsedOrg, parseInt(surveyId));
  const submissionsFuture = useSurveySubmissions(parsedOrg, parseInt(surveyId));

  const projectId =
    getSurveyProjectId(surveyFuture?.data, parsedOrg) || 'standalone';

  const router = useRouter();
  const isShared = projectId === 'shared';

  return (
    <>
      <Head>
        <title>{surveyFuture.data?.title}</title>
      </Head>
      <Grid container spacing={2}>
        <Grid size={{ md: isShared ? 12 : 8, sm: 12, xs: 12 }}>
          <ZUIFuture future={submissionsFuture}>
            {(data) => {
              let submissions = data;
              if (showUnlinkedOnly) {
                submissions = data.filter(
                  (sub) => sub.respondent && !sub.respondent.id
                );
                if (submissions.length === 0) {
                  router.push(
                    `/organize/${orgId}/projects/${projId}/surveys/${surveyId}/submissions`
                  );
                }
              }
              return submissions.length !== 0 || !showUnlinkedOnly ? (
                <SurveySubmissionsList submissions={submissions} />
              ) : null;
            }}
          </ZUIFuture>
        </Grid>
        <Grid size={{ md: 4, sm: 12, xs: 12 }}>
          <SubmissionWarningAlert
            orgId={parseInt(orgId)}
            projectId={projectId}
            showUnlinkedOnly={showUnlinkedOnly}
            surveyId={parseInt(surveyId)}
          />

          {!isShared && (
            <SurveySuborgsCard
              orgId={parseInt(orgId)}
              surveyId={parseInt(surveyId)}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

SubmissionsPage.getLayout = function getLayout(page, props) {
  return (
    <SurveyLayout
      orgId={props.orgId}
      projectId={props.projectId}
      surveyId={props.surveyId}
    >
      {page}
    </SurveyLayout>
  );
};

export default SubmissionsPage;
