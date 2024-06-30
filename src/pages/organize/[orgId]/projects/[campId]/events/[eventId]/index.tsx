import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import EventLayout from 'features/events/layout/EventLayout';
import EventOverviewCard from 'features/events/components/EventOverviewCard';
import EventParticipantsCard from 'features/events/components/EventParticipantsCard';
import EventRelatedCard from 'features/events/components/EventRelatedCard';
import useEvent from 'features/events/hooks/useEvent';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIFuture from 'zui/ZUIFuture';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, eventId } = ctx.params!;
    try {
      const backendApiClient = new BackendApiClient(ctx.req.headers);

      const event = await backendApiClient.get<ZetkinEvent>(
        `/api/orgs/${orgId}/actions/${eventId}`
      );
      const actualCampaign = event.campaign?.id.toString() ?? 'standalone';

      if (actualCampaign !== campId) {
        return { notFound: true };
      }
    } catch (error) {
      return { notFound: true };
    }
    return {
      props: {
        eventId,
        orgId,
      },
    };
  },
  {
    authLevelRequired: 2,
    localeScope: [],
  }
);

interface EventPageProps {
  eventId: string;
  orgId: string;
}

const EventPage: PageWithLayout<EventPageProps> = ({ orgId, eventId }) => {
  const eventFuture = useEvent(parseInt(orgId), parseInt(eventId));

  if (!eventFuture || !eventFuture.data) {
    return null;
  }

  return (
    <ZUIFuture future={eventFuture}>
      {(data) => {
        return (
          <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
              <EventOverviewCard data={data} orgId={parseInt(orgId)} />
            </Grid>
            <Grid item md={4} xs={6}>
              <EventParticipantsCard
                eventId={parseInt(eventId)}
                orgId={parseInt(orgId)}
              />
              <EventRelatedCard data={data} orgId={parseInt(orgId)} />
            </Grid>
          </Grid>
        );
      }}
    </ZUIFuture>
  );
};

EventPage.getLayout = function getLayout(page, props) {
  return (
    <EventLayout
      key={props.eventId}
      eventId={props.eventId}
      orgId={props.orgId}
    >
      {page}
    </EventLayout>
  );
};

export default EventPage;
