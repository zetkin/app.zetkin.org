import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';
import Head from 'next/head';

import BackendApiClient from 'core/api/client/BackendApiClient';
import JourneyCard from 'features/journeys/components/JourneyCard';
import JourneysLayout from 'features/journeys/layout/JourneysLayout';
import messageIds from 'features/journeys/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useJourneys from 'features/journeys/hooks/useJourneys';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinJourney, ZetkinOrganization } from 'utils/types/zetkin';
import ZUISection from 'zui/ZUISection';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.organizeJourneys'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;

  try {
    const apiClient = new BackendApiClient(ctx.req.headers);
    // Note: We don't actually care for the returned journeys or orgnaization, but we still want to perform
    // the api request to know if this user may access this particular page.
    await apiClient.get<ZetkinJourney[]>(`/api/orgs/${orgId}/journeys`);
    await apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`);

    return {
      props: {
        orgId,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

const AllJourneysOverviewPage: PageWithLayout = () => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();

  const journeysFuture = useJourneys(orgId);

  return (
    <>
      <Head>
        <title>{messages.journeys.title()}</title>
      </Head>
      <ZUISection title={messages.journeys.overview.overviewTitle()}>
        <Grid container spacing={2}>
          {journeysFuture.data?.map((journey: ZetkinJourney) => (
            <Grid key={journey.id} item lg={4} md={6} xl={3} xs={12}>
              <JourneyCard journey={journey} />
            </Grid>
          ))}
        </Grid>
      </ZUISection>
    </>
  );
};

AllJourneysOverviewPage.getLayout = function getLayout(page) {
  return <JourneysLayout>{page}</JourneysLayout>;
};

export default AllJourneysOverviewPage;
