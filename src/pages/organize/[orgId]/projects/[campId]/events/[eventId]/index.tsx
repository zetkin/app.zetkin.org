import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';

import EventDataModel from 'features/events/models/EventDataModel';
import EventLayout from 'features/events/layout/EventLayout';
import EventOverviewCard from 'features/events/components/EventOverviewCard';
import EventParticipantsCard from 'features/events/components/EventParticipantsCard';
import LocationsModel from 'features/events/models/LocationsModel';
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
  const dataModel = useModel(
    (env) => new EventDataModel(env, parseInt(orgId), parseInt(eventId))
  );

  const locationsModel = useModel(
    (env) => new LocationsModel(env, parseInt(orgId))
  );

  return (
    <ZUIFuture future={dataModel.getData()}>
      {() => {
        return (
          <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
              <EventOverviewCard
                dataModel={dataModel}
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
