import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Divider, Grid } from '@material-ui/core';

import JourneyInstanceLayout from 'layout/organize/JourneyInstanceLayout';
import { journeyInstanceResource } from 'api/journeys';
import JourneyInstanceSidebar from 'components/organize/journeys/JourneyInstanceSidebar';
import JourneyInstanceSummary from 'components/organize/journeys/JourneyInstanceSummary';
import { organizationResource } from 'api/organizations';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import { ZetkinJourneyInstance } from 'types/zetkin';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'misc', 'pages.organizeJourneyInstance'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, instanceId } = ctx.params!;

  const { state: orgQueryState } = await organizationResource(
    orgId as string
  ).prefetch(ctx);

  const { state: journeyInstanceQueryState } = await journeyInstanceResource(
    orgId as string,
    instanceId as string
  ).prefetch(ctx);

  if (
    orgQueryState?.status === 'success' &&
    journeyInstanceQueryState?.status === 'success'
  ) {
    return {
      props: {
        instanceId,
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
  orgId: string;
}

const JourneyDetailsPage: PageWithLayout<JourneyDetailsPageProps> = ({
  instanceId,
  orgId,
}) => {
  const journeyInstanceQuery = journeyInstanceResource(
    orgId,
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
      <Grid container justifyContent="space-between" spacing={2}>
        <Grid item md={6}>
          <JourneyInstanceSummary journeyInstance={journeyInstance} />
          <Divider style={{ marginTop: '2rem' }} />
        </Grid>
        <Grid item md={4}>
          <JourneyInstanceSidebar journeyInstance={journeyInstance} />
        </Grid>
      </Grid>
    </>
  );
};

JourneyDetailsPage.getLayout = function getLayout(page) {
  return <JourneyInstanceLayout>{page}</JourneyInstanceLayout>;
};

export default JourneyDetailsPage;
