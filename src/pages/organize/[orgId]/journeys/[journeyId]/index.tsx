import { Add } from '@material-ui/icons';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { Fab, makeStyles } from '@material-ui/core';

import AllJourneyInstancesLayout from 'layout/organize/AllJourneyInstancesLayout';
import getOrg from 'fetching/getOrg';
import JourneyInstancesDataTable from 'components/journeys/JourneyInstancesDataTable';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import { TagMetadata } from 'utils/getTagMetadata';
import ZetkinQuery from 'components/ZetkinQuery';
import { journeyInstancesResource, journeyResource } from 'api/journeys';
import { ZetkinJourney, ZetkinJourneyInstance } from 'types/zetkin';

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

interface JourneyInstancesData {
  journeyInstances: ZetkinJourneyInstance[];
  tagMetadata: TagMetadata;
}

const useStyles = makeStyles((theme) => ({
  fab: {
    bottom: theme.spacing(10),
    position: 'fixed',
    right: theme.spacing(4),
  },
}));

const JourneyInstancesOverviewPage: PageWithLayout<
  JourneyInstancesOverviewPageProps
> = ({ orgId, journeyId }) => {
  const journeyQuery = journeyResource(orgId, journeyId).useQuery();
  const journeyInstancesQuery = journeyInstancesResource(
    orgId,
    journeyId
  ).useQuery();
  const journey = journeyQuery.data as ZetkinJourney;

  const classes = useStyles();

  return (
    <>
      <Head>
        <title>{journey.plural_label}</title>
      </Head>
      <ZetkinQuery queries={{ journeyInstancesQuery }}>
        <JourneyInstancesDataTable
          {...(journeyInstancesQuery.data as JourneyInstancesData)}
        />
      </ZetkinQuery>
      <NextLink href={`/organize/${orgId}/journeys/${journeyId}/new`} passHref>
        <Fab
          className={classes.fab}
          color="primary"
          data-testid="JourneyInstanceOverviewPage-addFab"
        >
          <Add />
        </Fab>
      </NextLink>
    </>
  );
};

JourneyInstancesOverviewPage.getLayout = function getLayout(page) {
  return (
    <AllJourneyInstancesLayout fixedHeight>{page}</AllJourneyInstancesLayout>
  );
};

export default JourneyInstancesOverviewPage;
