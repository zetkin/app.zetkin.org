import { GetServerSideProps } from 'next';
import Head from 'next/head';

import AllJourneysLayout from 'layout/organize/AllJourneysLayout';
import getOrg from 'fetching/getOrg';
import JourneysInstancesDataTable from 'components/journeys/JourneysInstancesDataTable';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import { journeyInstancesResource, journeyResource } from 'api/journeys';
import { ZetkinJourney, ZetkinJourneyInstance } from 'types/zetkin';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'misc.breadcrumbs', 'pages.organizeJourney'],
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

type JourneyInstancesOverviewPageProps = {
  journeyId: string;
  orgId: string;
};

const JourneyInstancesOverviewPage: PageWithLayout<
  JourneyInstancesOverviewPageProps
> = ({ orgId, journeyId }) => {
  const journeyQuery = journeyResource(orgId, journeyId).useQuery();
  const journeyInstancesQuery = journeyInstancesResource(
    orgId,
    journeyId
  ).useQuery();
  const journey = journeyQuery.data as ZetkinJourney;
  const journeyInstances =
    journeyInstancesQuery.data as ZetkinJourneyInstance[];

  return (
    <>
      <Head>
        <title>{journey.plural_name}</title>
      </Head>
      <JourneysInstancesDataTable {...{ journey, journeyInstances }} />
    </>
  );
};

JourneyInstancesOverviewPage.getLayout = function getLayout(page) {
  return <AllJourneysLayout>{page}</AllJourneysLayout>;
};

export default JourneyInstancesOverviewPage;
