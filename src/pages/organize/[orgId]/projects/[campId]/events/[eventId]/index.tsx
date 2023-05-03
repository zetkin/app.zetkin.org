import BackendApiClient from 'core/api/client/BackendApiClient';
import { GetServerSideProps } from 'next';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { useState } from 'react';
import { Button, Grid } from '@mui/material';

import { CLUSTER_TYPE } from 'features/events/components/EventPopper/MultiEventPopper/MultiEventListItem';
import EventDataModel from 'features/events/models/EventDataModel';
import EventLayout from 'features/events/layout/EventLayout';
import EventOverviewCard from 'features/events/components/EventOverviewCard';
import EventParticipantsCard from 'features/events/components/EventParticipantsCard';
import { EventsModel } from 'features/events/models/EventsModel';
import LocationsModel from 'features/events/models/LocationsModel';
import MultiEventPopper from 'features/events/components/EventPopper/MultiEventPopper';
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
        campId,
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
  campId: string;
  eventId: string;
  orgId: string;
}

const EventPage: PageWithLayout<EventPageProps> = ({
  orgId,
  eventId,
  campId,
}) => {
  const dataModel = useModel(
    (env) => new EventDataModel(env, parseInt(orgId), parseInt(eventId))
  );
  const eventsModel = useModel((env) => new EventsModel(env, parseInt(orgId)));
  const locationsModel = useModel(
    (env) => new LocationsModel(env, parseInt(orgId))
  );
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const event = dataModel.getData().data;
  if (!event) {
    return null;
  }

  return (
    <>
      <Button
        onClick={(evt) => setAnchorEl(anchorEl ? null : evt.currentTarget)}
      >
        Click
      </Button>
      <MultiEventPopper
        anchorEl={anchorEl}
        clusterType={CLUSTER_TYPE.SHIFT}
        events={[event, event, event, event, event, event, event, event, event]}
        onClickAway={() => setAnchorEl(null)}
        open={!!anchorEl}
      />
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
                <EventParticipantsCard campId={campId} model={dataModel} />
              </Grid>
            </Grid>
          );
        }}
      </ZUIFuture>
    </>
  );
};

EventPage.getLayout = function getLayout(page, props) {
  return (
    <EventLayout
      campaignId={props.campId}
      eventId={props.eventId}
      orgId={props.orgId}
    >
      {page}
    </EventLayout>
  );
};

export default EventPage;
