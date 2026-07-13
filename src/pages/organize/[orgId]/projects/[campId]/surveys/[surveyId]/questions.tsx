import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { Grid, useMediaQuery, useTheme } from '@mui/material';
import dayjs from 'dayjs';

import messageIds from 'features/surveys/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SurveyEditor from 'features/surveys/components/SurveyEditor';
import SurveyLayout from 'features/surveys/layouts/SurveyLayout';
import { useMessages } from 'core/i18n';
import useSurvey from 'features/surveys/hooks/useSurvey';
import useSurveyStats from 'features/surveys/hooks/useSurveyStats';
import ZUIFuture from 'zui/ZUIFuture';
import ZUILockCard from 'zui/ZUILockCard';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { campId, orgId, surveyId } = ctx.params!;
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
  campId,
  orgId,
  surveyId,
}) => {
  const [forceEditable, setForceEditable] = useState(false);
  const surveyFuture = useSurvey(parseInt(orgId), parseInt(surveyId));
  const statsFuture = useSurveyStats(parseInt(orgId), parseInt(surveyId));

  // Figure out whether to display the read-only warning on top
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isShared = campId === 'shared';
  const messages = useMessages(messageIds);

  const now = dayjs();
  const today = now.format('YYYY-MM-DD');
  const surveyStart = dayjs(surveyFuture.data?.published).format('YYYY-MM-DD');
  const surveyEnd = dayjs(surveyFuture.data?.expires).format('YYYY-MM-DD');

  const isActive =
    surveyEnd && surveyStart
      ? surveyStart <= today && today <= surveyEnd
      : false;

  return (
    <>
      <Head>
        <title>{surveyFuture.data?.title}</title>
      </Head>
      <ZUIFuture future={statsFuture}>
        {(stats) => {
          const receivingSubmissions = stats.submissionCount > 0;
          const isEditingLocked = receivingSubmissions || isActive;
          return (
            <Grid
              container
              direction={isMobile ? 'column-reverse' : undefined}
              spacing={2}
            >
              <Grid size={{ md: 8, xs: 12 }}>
                <SurveyEditor
                  orgId={parseInt(orgId)}
                  readOnly={(isEditingLocked && !forceEditable) || isShared}
                  surveyId={parseInt(surveyId)}
                />
              </Grid>

              <Grid size={{ md: 4, xs: 12 }}>
                {isEditingLocked && !isShared && (
                  <ZUILockCard
                    isActive={forceEditable}
                    lockedHeader={messages.editWarning.locked.header()}
                    lockedSubheader={messages.editWarning.locked.subheader()}
                    onToggle={(newValue) => setForceEditable(newValue)}
                    tips={{
                      safe: {
                        bullets: [
                          messages.editWarning.editing.safe.bullet1(),
                          messages.editWarning.editing.safe.bullet2(),
                          messages.editWarning.editing.safe.bullet3(),
                          messages.editWarning.editing.safe.bullet4(),
                        ],
                        header: messages.editWarning.editing.safe.header(),
                        iconType: 'check',
                      },
                      unsafe: {
                        bullets: [
                          messages.editWarning.editing.unsafe.bullet1(),
                          messages.editWarning.editing.unsafe.bullet2(),
                        ],
                        header: messages.editWarning.editing.unsafe.header(),
                        iconType: 'close',
                      },
                    }}
                    unlockedHeader={messages.editWarning.editing.header()}
                    unlockedSubheader={messages.editWarning.editing.subheader()}
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
      campId={props.campId}
      orgId={props.orgId}
      surveyId={props.surveyId}
    >
      {page}
    </SurveyLayout>
  );
};

export default QuestionsPage;
