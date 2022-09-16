import { GetServerSideProps } from 'next';
import { Grid } from '@material-ui/core';
import Head from 'next/head';
import { useIntl } from 'react-intl';

import JourneyCard from 'features/journeys/components/JourneyCard';
import JourneysLayout from 'features/journeys/layout/JourneysLayout';
import { journeysResource } from 'features/journeys/api/journeys';
import { organizationResource } from 'features/journeys/api/organizations';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { ZetkinJourney } from 'utils/types/zetkin';
import ZUISection from 'zui/ZUISection';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.organizeJourneys'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;

  const { state: orgQueryState } = await organizationResource(
    orgId as string
  ).prefetch(ctx);

  const { state: journeysQueryState } = await journeysResource(
    orgId as string
  ).prefetch(ctx);

  if (
    orgQueryState?.status === 'success' &&
    journeysQueryState?.status === 'success'
  ) {
    return {
      props: {
        orgId,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

type AllJourneysOverviewPageProps = {
  orgId: string;
};

const AllJourneysOverviewPage: PageWithLayout<AllJourneysOverviewPageProps> = ({
  orgId,
}) => {
  const intl = useIntl();

  const journeysQuery = journeysResource(orgId).useQuery();
  const journeys = journeysQuery.data || [];

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({
            id: 'layout.organize.journeys.title',
          })}
        </title>
      </Head>
      <ZUISection
        title={intl.formatMessage({
          id: 'misc.journeys.overview.overviewTitle',
        })}
      >
        <Grid container spacing={2}>
          {journeys.map((journey: ZetkinJourney) => (
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
