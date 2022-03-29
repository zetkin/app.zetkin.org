import { GetServerSideProps } from 'next';
import Head from 'next/head';

import AllJourneysLayout from 'layout/organize/AllJourneysLayout';
import getOrg from 'fetching/getOrg';
import JourneysDataTable from 'components/journeys/JourneysDataTable';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import { ZetkinJourneyInstance } from 'types/zetkin';

// TODO: delete once done with UI design
import MarxistTraining from '../../../../../../playwright/mockData/orgs/KPD/journeys/MarxistTraining';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize.journeys', 'misc.breadcrumbs'],
};

// TODO: will need to fetch real journeys data here, once the journeys API is baked and out of the dev oven
export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, journeyId } = ctx.params!;

  await ctx.queryClient.prefetchQuery(
    ['org', orgId],
    getOrg(orgId as string, ctx.apiFetch)
  );
  const orgState = ctx.queryClient.getQueryState(['org', orgId]);

  if (orgState?.status === 'success') {
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

type JourneyOverviewPageProps = {
  journeyId: string;
  orgId?: string;
};

const JourneysOverviewPage: PageWithLayout<JourneyOverviewPageProps> = () => {
  const journey = MarxistTraining;
  const journeyInstances: ZetkinJourneyInstance[] = [];

  return (
    <>
      <Head>
        <title>{journey.plural_name}</title>
      </Head>
      <JourneysDataTable {...{ journeyInstances }} />
    </>
  );
};

JourneysOverviewPage.getLayout = function getLayout(page) {
  return <AllJourneysLayout>{page}</AllJourneysLayout>;
};

export default JourneysOverviewPage;
