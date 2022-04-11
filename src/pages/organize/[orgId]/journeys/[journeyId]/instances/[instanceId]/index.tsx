import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';
import { Divider, Grid } from '@material-ui/core';

import JourneyInstanceLayout from 'layout/organize/JourneyInstanceLayout';
import { journeyInstanceResource } from 'api/journeys';
import JourneyInstanceSummary from 'components/organize/journeys/JourneyInstanceSummary';
import JourneyMilestoneProgress from 'components/organize/journeys/JourneyMilestoneProgress';
import { organizationResource } from 'api/organizations';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import { ZetkinJourneyInstance } from 'types/zetkin';
import ZetkinSection from 'components/ZetkinSection';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'misc', 'pages.organizeJourneyInstance'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, journeyId, instanceId } = ctx.params!;

  const { state: orgQueryState } = await organizationResource(
    orgId as string
  ).prefetch(ctx);

  const { state: journeyInstanceQueryState } = await journeyInstanceResource(
    orgId as string,
    journeyId as string,
    instanceId as string
  ).prefetch(ctx);

  if (
    orgQueryState?.status === 'success' &&
    journeyInstanceQueryState?.status === 'success'
  ) {
    return {
      props: {
        instanceId,
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

interface JourneyDetailsPageProps {
  instanceId: string;
  journeyId: string;
  orgId: string;
}

const JourneyDetailsPage: PageWithLayout<JourneyDetailsPageProps> = ({
  instanceId,
  journeyId,
  orgId,
}) => {
  const journeyInstanceQuery = journeyInstanceResource(
    orgId,
    journeyId,
    instanceId
  ).useQuery();
  const journeyInstance = journeyInstanceQuery.data as ZetkinJourneyInstance;

  const intl = useIntl();

  return (
    <>
      <Head>
        <title>
          {`${journeyInstance.title || journeyInstance.journey.title} #${
            journeyInstance.id
          }`}
        </title>
      </Head>
      <Grid container justifyContent="space-between" spacing={2}>
        <Grid item md={6}>
          <JourneyInstanceSummary journeyInstance={journeyInstance} />
          <Divider style={{ marginTop: '2rem' }} />
        </Grid>
        <Grid item md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ZetkinSection
                title={intl.formatMessage({
                  id: 'pages.organizeJourneyInstance.assignedTo',
                })}
              ></ZetkinSection>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <ZetkinSection
                title={intl.formatMessage({
                  id: 'pages.organizeJourneyInstance.members',
                })}
              ></ZetkinSection>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <ZetkinSection
                title={intl.formatMessage({
                  id: 'pages.organizeJourneyInstance.tags',
                })}
              ></ZetkinSection>
              <Divider />
            </Grid>
            {journeyInstance.milestones && (
              <Grid item xs={12}>
                <ZetkinSection
                  title={intl.formatMessage({
                    id: 'pages.organizeJourneyInstance.milestones',
                  })}
                >
                  <JourneyMilestoneProgress
                    milestones={journeyInstance.milestones}
                    next_milestone={journeyInstance.next_milestone}
                  />
                </ZetkinSection>
                <Divider />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

JourneyDetailsPage.getLayout = function getLayout(page) {
  return <JourneyInstanceLayout>{page}</JourneyInstanceLayout>;
};

export default JourneyDetailsPage;
