import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { FormattedMessage as Msg } from 'react-intl';
import { Box, Divider, Typography } from '@material-ui/core';

import JourneyInstanceLayout from 'layout/organize/JourneyInstanceLayout';
import { journeyInstanceResource } from 'api/journeys';
import JourneyInstanceSummary from 'components/organize/journeys/JourneyInstanceSummary';
import JourneyMilestoneProgress from 'components/organize/journeys/JourneyMilestoneProgress';
import { organizationResource } from 'api/organizations';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import { ZetkinJourneyInstance } from 'types/zetkin';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'misc', 'pages.organizeJourneyInstance'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, journeyId, instanceId } = ctx.params!;

  const { state: orgQueryState } = await organizationResource(
    orgId as string
  ).prefetch(ctx);

  const { state: journeyInstanceQueryState } = await journeyInstanceResource(
    orgId as string,
    journeyId as string,
    instanceId as string
  ).prefetch(ctx);

  if (
    orgQueryState?.status === 'success' &&
    journeyInstanceQueryState?.status === 'success'
  ) {
    return {
      props: {
        instanceId,
        journeyId,
        orgId,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

interface JourneyDetailsPageProps {
  instanceId: string;
  journeyId: string;
  orgId: string;
}

const JourneyDetailsPage: PageWithLayout<JourneyDetailsPageProps> = ({
  instanceId,
  journeyId,
  orgId,
}) => {
  const journeyInstanceQuery = journeyInstanceResource(
    orgId,
    journeyId,
    instanceId
  ).useQuery();
  const journeyInstance = journeyInstanceQuery.data as ZetkinJourneyInstance;

  return (
    <>
      <Head>
        <title>
          {`${journeyInstance.title || journeyInstance.journey.title} #${
            journeyInstance.id
          }`}
        </title>
      </Head>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Box width="50%">
          <JourneyInstanceSummary journeyInstance={journeyInstance} />
        </Box>
        <Box pr={3} width="30%">
          <Typography>
            <Msg id="pages.organizeJourneyInstance.assignedTo" />
          </Typography>
          <Divider />
          <Typography>
            <Msg id="pages.organizeJourneyInstance.members" />
          </Typography>
          <Divider />
          <Typography>
            <Msg id="pages.organizeJourneyInstance.tags" />
          </Typography>
          <Divider />
          {journeyInstance.milestones && (
            <>
              <Typography>
                <Msg id="pages.organizeJourneyInstance.milestones" />
              </Typography>
              <JourneyMilestoneProgress
                milestones={journeyInstance.milestones}
                next_milestone={journeyInstance.next_milestone}
              />
              <Divider />
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

JourneyDetailsPage.getLayout = function getLayout(page) {
  return <JourneyInstanceLayout>{page}</JourneyInstanceLayout>;
};

export default JourneyDetailsPage;
