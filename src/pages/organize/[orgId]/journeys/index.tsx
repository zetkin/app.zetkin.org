import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';
import { Box, Grid } from '@material-ui/core';

import JourneyCard from 'components/organize/journeys/JourneyCard';
import JourneysLayout from 'layout/organize/JourneysLayout';
import { journeysResource } from 'api/journeys';
import { organizationResource } from 'api/organizations';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import { ZetkinJourney } from 'types/zetkin';
import ZetkinSection from 'components/ZetkinSection';
const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'misc', 'pages.organizeAllJourneys'],
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
      <ZetkinSection
        title={intl.formatMessage({
          id: 'misc.journeys.overview.overviewTitle',
        })}
      >
        <Box
          display="grid"
          gridGap={20}
          gridTemplateColumns="repeat( auto-fit, minmax(450px, 1fr) )"
        >
          {journeys.map((journey: ZetkinJourney) => (
            <Grid key={journey.id} item>
              <JourneyCard journey={journey} />
            </Grid>
          ))}
        </Box>
      </ZetkinSection>
    </>
  );
};

AllJourneysOverviewPage.getLayout = function getLayout(page) {
  return <JourneysLayout>{page}</JourneysLayout>;
};

export default AllJourneysOverviewPage;
