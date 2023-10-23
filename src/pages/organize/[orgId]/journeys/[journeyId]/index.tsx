import { GetServerSideProps } from 'next';
import Head from 'next/head';

import AllJourneyInstancesLayout from 'features/journeys/layout/AllJourneyInstancesLayout';
import BackendApiClient from 'core/api/client/BackendApiClient';
import getOrg from 'utils/fetching/getOrg';
import JourneyInstanceCreateFab from 'features/journeys/components/JourneyInstanceCreateFab';
import JourneyInstancesDataTable from 'features/journeys/components/JourneyInstancesDataTable';
import { journeyInstancesResource } from 'features/journeys/api/journeys';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useJourney from 'features/journeys/hooks/useJourney';
import ZUIQuery from 'zui/ZUIQuery';

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

  const apiClient = new BackendApiClient(ctx.req.headers);
  const journey = await apiClient.get(
    `/api/orgs/${orgId}/journeys/${journeyId}`
  );

  if (orgState?.status === 'success' && journey) {
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
  const journeyInstancesQuery = journeyInstancesResource(
    orgId,
    journeyId
  ).useQuery();
  const journeyFuture = useJourney(parseInt(orgId), parseInt(journeyId));

  return (
    <>
      <Head>
        <title>{journeyFuture.data?.plural_label}</title>
      </Head>
      <ZUIQuery queries={{ journeyInstancesQuery }}>
        {({ queries: { journeyInstancesQuery } }) => {
          const openJourneyInstances =
            journeyInstancesQuery.data.journeyInstances.filter(
              (journeyInstance) => journeyInstance.closed == null
            );

          return (
            <JourneyInstancesDataTable
              journeyInstances={openJourneyInstances}
              storageKey={`journeyInstances-${journeyFuture.data?.id}-open`}
              tagColumnsData={journeyInstancesQuery.data.tagColumnsData}
            />
          );
        }}
      </ZUIQuery>
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
