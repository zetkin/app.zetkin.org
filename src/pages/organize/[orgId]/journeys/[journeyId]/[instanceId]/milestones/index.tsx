import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { FormattedMessage as Msg } from 'react-intl';
import { Grid, LinearProgress, Typography } from '@mui/material';

import { getCompletionPercentage } from 'features/journeys/components/JourneyMilestoneProgress';
import JourneyInstanceLayout from 'features/journeys/layout/JourneyInstanceLayout';
import { journeyInstanceResource } from 'features/journeys/api/journeys';
import JourneyMilestoneCard from 'features/journeys/components/JourneyMilestoneCard';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';
import {
  getJourneyInstanceScaffoldProps,
  JourneyDetailsPageProps,
  scaffoldOptions,
} from '../index';

export const getServerSideProps: GetServerSideProps = scaffold(
  getJourneyInstanceScaffoldProps,
  scaffoldOptions
);

const JourneyMilestonesPage: PageWithLayout<JourneyDetailsPageProps> = ({
  instanceId,
  orgId,
}) => {
  const { useQuery } = journeyInstanceResource(orgId, instanceId);
  const journeyInstanceQuery = useQuery();
  const journeyInstance = journeyInstanceQuery.data as ZetkinJourneyInstance;

  const percentComplete = getCompletionPercentage(
    journeyInstance.milestones || []
  );

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
          {journeyInstance.milestones ? (
            <>
              <Typography
                style={{
                  padding: '1rem 0 1rem 0',
                }}
                variant="h4"
              >
                <Msg
                  id="pages.organizeJourneyInstance.percentComplete"
                  values={{ percentComplete }}
                />
              </Typography>
              <LinearProgress value={percentComplete} variant="determinate" />
              {journeyInstance.milestones.map((milestone) => (
                <JourneyMilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                />
              ))}
            </>
          ) : (
            <Typography data-testid="JourneyMilestoneCard-noMilestones">
              <Msg id="pages.organizeJourneyInstance.noMilestones" />
            </Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
};

JourneyMilestonesPage.getLayout = function getLayout(page) {
  return <JourneyInstanceLayout>{page}</JourneyInstanceLayout>;
};

export default JourneyMilestonesPage;
