import { GetServerSideProps } from 'next';
import { FormattedMessage as Msg } from 'react-intl';
import { QuizOutlined } from '@mui/icons-material';
import { Box, Button, Link, Typography } from '@mui/material';

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
      {survey.elements.length ? (
        <></>
      ) : (
        <Box alignItems="center" display="flex" flexDirection="column">
          <QuizOutlined
            color="secondary"
            sx={{ fontSize: '8em', paddingBottom: 2 }}
          />
          <Typography color="secondary">
            <Msg id="pages.organizeSurvey.overview.noQuestions.title" />
          </Typography>
          <Link
            href={`/organize/${orgId}/campaigns/${campId}/surveys/${surveyId}/questions`}
            sx={{ marginTop: 4 }}
            underline="none"
          >
            <Button variant="contained">
              <Msg id="pages.organizeSurvey.overview.noQuestions.button" />
            </Button>
          </Link>
        </Box>
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
