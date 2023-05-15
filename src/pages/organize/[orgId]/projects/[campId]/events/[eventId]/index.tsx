import BackendApiClient from 'core/api/client/BackendApiClient';
import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';

import EventDataModel from 'features/events/models/EventDataModel';
import EventLayout from 'features/events/layout/EventLayout';
import EventOverviewCard from 'features/events/components/EventOverviewCard';
import EventParticipantsCard from 'features/events/components/EventParticipantsCard';
import EventRelatedCard from 'features/events/components/EventRelatedCard';
import { EventsModel } from 'features/events/models/EventsModel';
import LocationsModel from 'features/events/models/LocationsModel';
import useModel from 'core/useModel';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIFuture from 'zui/ZUIFuture';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, eventId } = ctx.params!;
    try {
      const client = new BackendApiClient(ctx.req.headers);
      const data = await client.get<ZetkinEvent>(
        `/api/orgs/${orgId}/actions/${eventId}`
      );
      const actualCampaign = data.campaign?.id.toString() ?? 'standalone';
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
  const dataModel = useModel(
    (env) => new EventDataModel(env, parseInt(orgId), parseInt(eventId))
  );
  const eventsModel = useModel((env) => new EventsModel(env, parseInt(orgId)));
  const locationsModel = useModel(
    (env) => new LocationsModel(env, parseInt(orgId))
  );
  const event = dataModel.getData().data;
  if (!event) {
    return null;
  }

  return (
    <ZUIFuture future={dataModel.getData()}>
      {(data) => {
        return (
          <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
              <EventOverviewCard
                data={data}
                dataModel={dataModel}
                eventsModel={eventsModel}
                locationsModel={locationsModel}
              />
            </Grid>
            <Grid item md={4} xs={6}>
              <EventParticipantsCard model={dataModel} />
              <EventRelatedCard data={data} model={eventsModel} />
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
