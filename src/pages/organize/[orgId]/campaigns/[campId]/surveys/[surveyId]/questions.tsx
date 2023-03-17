import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SurveyDataModel from 'features/surveys/models/SurveyDataModel';
import SurveyEditor from 'features/surveys/components/SurveyEditor';
import SurveyLayout from 'features/surveys/layout/SurveyLayout';
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

interface QuestionsPageProps {
  campId: string;
  orgId: string;
  surveyId: string;
}

const QuestionsPage: PageWithLayout<QuestionsPageProps> = ({
  orgId,
  surveyId,
}) => {
  const model = useModel(
    (env) => new SurveyDataModel(env, parseInt(orgId), parseInt(surveyId))
  );

  return (
    <>
      <Head>
        <title>{model.getData().data?.title}</title>
      </Head>
      <ZUIFuture future={model.getStats()}>
        {(stats) => {
          return (
            <Box>
              <SurveyEditor
                model={model}
                readOnly={stats.submissionCount > 0}
              />
            </Box>
          );
        }}
      </ZUIFuture>
    </>
  );
};

QuestionsPage.getLayout = function getLayout(page, props) {
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

export default QuestionsPage;
