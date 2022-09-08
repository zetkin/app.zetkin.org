import { GetServerSideProps } from 'next';
import Head from 'next/head';

import AllJourneyInstancesLayout from 'features/journeys/layouts/AllJourneyInstancesLayout';
import getOrg from 'utils/fetching/getOrg';
import JourneyInstanceCreateFab from 'components/journeys/JourneyInstanceCreateFab';
import JourneyInstancesDataTable from 'features/journeys/components/JourneyInstancesDataTable';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { ZetkinJourney } from 'utils/types/zetkin';
import ZetkinQuery from 'components/ZetkinQuery';
import {
  journeyInstancesResource,
  journeyResource,
} from 'features/journeys/api/journeys';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.organizeJourney'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, journeyId } = ctx.params!;

  await ctx.queryClient.prefetchQuery(
    ['org', orgId],
    getOrg(orgId as string, ctx.apiFetch)
  );
  const orgState = ctx.queryClient.getQueryState(['org', orgId]);

  const { state: journeyQueryState } = await journeyResource(
    orgId as string,
    journeyId as string
  ).prefetch(ctx);

  if (
    orgState?.status === 'success' &&
    journeyQueryState?.status === 'success'
  ) {
    return {
      props: {
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

type OpenJourneyInstancesPageProps = {
  journeyId: string;
  orgId: string;
};

const OpenJourneyInstancesPage: PageWithLayout<
  OpenJourneyInstancesPageProps
> = ({ orgId, journeyId }) => {
  const journeyQuery = journeyResource(orgId, journeyId).useQuery();
  const journeyInstancesQuery = journeyInstancesResource(
    orgId,
    journeyId
  ).useQuery();
  const journey = journeyQuery.data as ZetkinJourney;

  return (
    <>
      <Head>
        <title>{journey.plural_label}</title>
      </Head>
      <ZetkinQuery queries={{ journeyInstancesQuery }}>
        {({ queries: { journeyInstancesQuery } }) => {
          const openJourneyInstances =
            journeyInstancesQuery.data.journeyInstances.filter(
              (journeyInstance) => journeyInstance.closed == null
            );

          return (
            <JourneyInstancesDataTable
              journeyInstances={openJourneyInstances}
              storageKey={`journeyInstances-${journey.id}-open`}
              tagColumnsData={journeyInstancesQuery.data.tagColumnsData}
            />
          );
        }}
      </ZetkinQuery>
      <JourneyInstanceCreateFab />
    </>
  );
};

OpenJourneyInstancesPage.getLayout = function getLayout(page) {
  return (
    <AllJourneyInstancesLayout fixedHeight>{page}</AllJourneyInstancesLayout>
  );
};

export default OpenJourneyInstancesPage;
