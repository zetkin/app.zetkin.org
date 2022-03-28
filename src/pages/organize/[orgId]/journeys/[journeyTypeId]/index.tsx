import { GetServerSideProps } from 'next';
import Head from 'next/head';

import AllJourneysLayout from 'layout/organize/AllJourneysLayout';
import getOrg from 'fetching/getOrg';
import JourneysDataTable from 'components/journeys/JourneysDataTable';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize.journeys', 'misc.breadcrumbs'],
};

// TODO: will need to fetch real journeys data here, once the journeys API is baked and out of the dev oven
export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, journeyTypeId } = ctx.params!;

  await ctx.queryClient.prefetchQuery(
    ['org', orgId],
    getOrg(orgId as string, ctx.apiFetch)
  );
  const orgState = ctx.queryClient.getQueryState(['org', orgId]);

  if (orgState?.status === 'success') {
    return {
      props: {
        journeyTypeId,
        orgId,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

type JourneyOverviewPageProps = {
  journeyTypeId: string;
  orgId?: string;
};

const JourneysOverviewPage: PageWithLayout<JourneyOverviewPageProps> = ({
  journeyTypeId,
}) => {
  const journeys = [{ id: 1 }];

  return (
    <>
      <Head>
        <title>{journeyTypeId}</title>
      </Head>
      <JourneysDataTable journeys={journeys} />
    </>
  );
};

JourneysOverviewPage.getLayout = function getLayout(page) {
  return <AllJourneysLayout>{page}</AllJourneysLayout>;
};

export default JourneysOverviewPage;
