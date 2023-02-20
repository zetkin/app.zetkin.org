import { GetServerSideProps } from 'next';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SurveyLayout from 'features/surveys/layout/SurveyLayout';
import SurveySubmissionsList from 'features/surveys/components/SurveySubmissionsList';
import SurveySubmissionsModel from 'features/surveys/models/SurveySubmissionsModel';
import useModel from 'core/useModel';
import ZUIFutures from 'zui/ZUIFutures';

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
    <>
      <ZUIFutures futures={{ submissions: subsModel.getSubmissions() }}>
        {({ data: { submissions } }) => {
          return (
            <>
              <SurveySubmissionsList submissions={submissions} />
            </>
          );
        }}
      </ZUIFutures>
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
