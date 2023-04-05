import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';

import EventDataModel from 'features/events/models/EventDataModel';
import EventLayout from 'features/events/layout/EventLayout';
import EventOverviewCard from 'features/events/components/EventOverviewCard/EventOverviewCard';
import EventParticipantsCard from 'features/events/components/EventOverviewCard/EventParticipantsCard';
import useModel from 'core/useModel';
import ZUIFuture from 'zui/ZUIFuture';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, eventId } = ctx.params!;

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
  const model = useModel(
    (env) => new EventDataModel(env, parseInt(orgId), parseInt(eventId))
  );

  return (
    <ZUIFuture future={model.getData()}>
      {() => {
        return (
          <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
              <EventOverviewCard model={model} />
            </Grid>
            <Grid item md={4} xs={6}>
              <EventParticipantsCard campId={campId} model={model} />
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
      campaignId={props.campId}
      eventId={props.eventId}
      orgId={props.orgId}
    >
      {page}
    </EventLayout>
  );
};

export default EventPage;
