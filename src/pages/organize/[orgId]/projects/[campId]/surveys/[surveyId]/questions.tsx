import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { Grid, useMediaQuery, useTheme } from '@mui/material';

import EditWarningCard from 'features/surveys/components/EditWarningCard';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SurveyDataModel from 'features/surveys/models/SurveyDataModel';
import SurveyEditor from 'features/surveys/components/SurveyEditor';
import SurveyLayout from 'features/surveys/layout/SurveyLayout';
import useModel from 'core/useModel';
import useSurveyStats from 'features/surveys/hooks/useSurveyStats';
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
  const [forceEditable, setForceEditable] = useState(false);
  const statsFuture = useSurveyStats(parseInt(orgId), parseInt(surveyId));
  const model = useModel(
    (env) => new SurveyDataModel(env, parseInt(orgId), parseInt(surveyId))
  );

  // Figure out whether to display the read-only warning on top
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Head>
        <title>{model.getData().data?.title}</title>
      </Head>
      <ZUIFuture future={statsFuture}>
        {(stats) => {
          const receivingSubmissions = stats.submissionCount > 0;
          return (
            <Grid
              container
              direction={isMobile ? 'column-reverse' : undefined}
              spacing={2}
            >
              <Grid item md={8} xs={12}>
                <SurveyEditor
                  model={model}
                  readOnly={receivingSubmissions && !forceEditable}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                {receivingSubmissions && (
                  <EditWarningCard
                    editing={forceEditable}
                    onToggle={(newValue) => setForceEditable(newValue)}
                  />
                )}
              </Grid>
            </Grid>
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
