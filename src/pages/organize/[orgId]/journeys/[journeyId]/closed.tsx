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
import ZUIFuture from 'zui/ZUIFuture';
import { ZetkinJourney, ZetkinOrganization } from 'utils/types/zetkin';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.organizeJourney'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, journeyId } = ctx.params!;

  const apiClient = new BackendApiClient(ctx.req.headers);
  const organization = await apiClient.get<ZetkinOrganization>(
    `/api/orgs/${orgId}`
  );
  const journey = await apiClient.get<ZetkinJourney>(
    `/api/orgs/${orgId}/journeys/${journeyId}`
  );

  if (organization && journey) {
    return {
      props: {},
    };
  } else {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

const ClosedJourneyInstancesPage: PageWithLayout = () => {
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
            (journeyInstance) => Boolean(journeyInstance.closed)
          );

          return (
            <JourneyInstancesDataTable
              journeyInstances={openJourneyInstances}
              storageKey={`journeyInstances-${journeyFuture.data?.id}-closed`}
              tagColumnsData={data.tagColumnsData}
            />
          );
        }}
      </ZUIFuture>
      <JourneyInstanceCreateFab />
    </>
  );
};

ClosedJourneyInstancesPage.getLayout = function getLayout(page) {
  return (
    <AllJourneyInstancesLayout fixedHeight>{page}</AllJourneyInstancesLayout>
  );
};

export default ClosedJourneyInstancesPage;
