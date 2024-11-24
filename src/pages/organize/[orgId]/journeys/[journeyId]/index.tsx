import { GetServerSideProps } from 'next';
import Head from 'next/head';

import AllJourneyInstancesLayout from 'features/journeys/layout/AllJourneyInstancesLayout';
import BackendApiClient from 'core/api/client/BackendApiClient';
import JourneyInstanceCreateFab from 'features/journeys/components/JourneyInstanceCreateFab';
import JourneyInstancesDataTable from 'features/journeys/components/JourneyInstancesDataTable';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useJourney from 'features/journeys/hooks/useJourney';
import useJourneyInstances from 'features/journeys/hooks/useJourneyInstances';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinJourney } from 'utils/types/zetkin';
import ZUIFuture from 'zui/ZUIFuture';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.organizeJourney'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, journeyId } = ctx.params!;

  try {
    const apiClient = new BackendApiClient(ctx.req.headers);
    await apiClient.get<ZetkinJourney>(
      `/api/orgs/${orgId}/journeys/${journeyId}`
    );
    return {
      props: {},
    };
  } catch {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

const OpenJourneyInstancesPage: PageWithLayout = () => {
  const { orgId, journeyId } = useNumericRouteParams();
  const journeyFuture = useJourney(orgId, journeyId);
  const journeyInstancesFuture = useJourneyInstances(orgId, journeyId);

  return (
    <>
      <Head>
        <title>{journeyFuture.data?.plural_label}</title>
      </Head>
      <ZUIFuture future={journeyInstancesFuture}>
        {(data) => {
          const openJourneyInstances = data.journeyInstances.filter(
            (journeyInstance) => journeyInstance.closed == null
          );

          return (
            <JourneyInstancesDataTable
              journeyInstances={openJourneyInstances}
              storageKey={`journeyInstances-${journeyFuture.data?.id}-open`}
              tagColumnsData={data.tagColumnsData}
            />
          );
        }}
      </ZUIFuture>
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
