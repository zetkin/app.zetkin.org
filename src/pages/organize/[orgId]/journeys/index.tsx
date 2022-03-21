import Head from 'next/head';
import { useIntl } from 'react-intl';
import { Box, Grid } from '@material-ui/core';

import getJourneys from 'fetching/getJourneys';
import { GetServerSideProps } from 'next';
import JourneyCard from 'components/organize/journeys/JourneyCard';
import JourneysLayout from 'layout/organize/JourneysLayout';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import { useQuery } from 'react-query';
import { ZetkinJourney } from 'types/zetkin';
import ZetkinSection from 'components/ZetkinSection';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'misc', 'pages.organizeAllJourneys'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;

  return {
    props: {
      orgId,
    },
  };
}, scaffoldOptions);

type AllJourneysOverviewPageProps = {
  orgId: string;
};

const AllJourneysOverviewPage: PageWithLayout<AllJourneysOverviewPageProps> = ({
  orgId,
}) => {
  const intl = useIntl();

  const journeysQuery = useQuery(['journeys', orgId], getJourneys(orgId));
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
