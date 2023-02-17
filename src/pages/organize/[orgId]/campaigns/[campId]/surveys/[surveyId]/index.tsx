import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';

import EmptyOverview from 'features/surveys/components/EmptyOverview';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SurveyDataModel from 'features/surveys/models/SurveyDataModel';
import SurveyLayout from 'features/surveys/layout/SurveyLayout';
import useModel from 'core/useModel';
import useServerSide from 'core/useServerSide';

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

  if (onServer) {
    return null;
  }

  const { data: survey } = model.getData();

  if (!survey) {
    return null;
  }

  return (
    <Box
      alignItems="center"
      display="flex"
      justifyContent="center"
      paddingTop={8}
    >
      {model.surveyIsEmpty && (
        <EmptyOverview campId={campId} orgId={orgId} surveyId={surveyId} />
      )}
    </Box>
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
