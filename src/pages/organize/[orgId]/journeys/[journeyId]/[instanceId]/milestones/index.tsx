import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Grid, LinearProgress, Typography } from '@mui/material';

import { getCompletionPercentage } from 'features/journeys/components/JourneyMilestoneProgress';
import JourneyInstanceLayout from 'features/journeys/layout/JourneyInstanceLayout';
import JourneyMilestoneCard from 'features/journeys/components/JourneyMilestoneCard';
import messageIds from 'features/journeys/l10n/messageIds';
import { Msg } from 'core/i18n';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useJourneyInstance from 'features/journeys/hooks/useJourneyInstance';
import useJourneyInstanceMilestones from 'features/journeys/hooks/useJourneyInstanceMilestones';
import { useNumericRouteParams } from 'core/hooks';
import { getJourneyInstanceScaffoldProps, scaffoldOptions } from '../index';

export const getServerSideProps: GetServerSideProps = scaffold(
  getJourneyInstanceScaffoldProps,
  scaffoldOptions
);

const JourneyMilestonesPage: PageWithLayout = () => {
  const { orgId, instanceId } = useNumericRouteParams();
  const journeyInstanceFuture = useJourneyInstance(orgId, instanceId);
  const milestonesFuture = useJourneyInstanceMilestones(orgId, instanceId);
  const journeyInstance = journeyInstanceFuture.data;
  const milestones = milestonesFuture.data || [];

  if (!journeyInstance) {
    return null;
  }

  const percentComplete = getCompletionPercentage(milestones);

  return (
    <>
      <Head>
        <title>
          {`${journeyInstance.title || journeyInstance.journey.title} #${
            journeyInstance.id
          }`}
        </title>
      </Head>
      <Grid container justifyContent="space-between" spacing={2}>
        <Grid item lg={8} md={10} xl={6} xs={12}>
          <Typography
            style={{
              padding: '1rem 0 1rem 0',
            }}
            variant="h4"
          >
            <Msg
              id={messageIds.instance.percentComplete}
              values={{ percentComplete }}
            />
          </Typography>
          <LinearProgress value={percentComplete} variant="determinate" />
          {milestones.map((milestone) => (
            <JourneyMilestoneCard key={milestone.id} milestone={milestone} />
          ))}
        </Grid>
      </Grid>
    </>
  );
};

JourneyMilestonesPage.getLayout = function getLayout(page) {
  return <JourneyInstanceLayout>{page}</JourneyInstanceLayout>;
};

export default JourneyMilestonesPage;
