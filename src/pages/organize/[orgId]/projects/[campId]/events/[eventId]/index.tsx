import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';

import EventDataModel from 'features/events/models/EventDataModel';
import EventLayout from 'features/events/layout/EventLayout';
import EventOverviewCard from 'features/events/components/EventOverviewCard/EventOverviewCard';
import useModel from 'core/useModel';
import { useState } from 'react';
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

const EventPage: PageWithLayout<EventPageProps> = ({ orgId, eventId }) => {
  const model = useModel(
    (env) => new EventDataModel(env, parseInt(orgId), parseInt(eventId))
  );

  const [idOfBlockInEditMode, setIdOfBlockInEditMode] = useState<
    number | undefined
  >();

  return (
    <ZUIFuture future={model.getData()}>
      {(data) => {
        return (
          <Grid container spacing={1}>
            <Grid item sm={8}>
              <EventOverviewCard
                editable={data.id == idOfBlockInEditMode}
                element={data}
                model={model}
                onEditModeEnter={() => setIdOfBlockInEditMode(data.id)}
                onEditModeExit={() => {
                  setIdOfBlockInEditMode(undefined);
                }}
              ></EventOverviewCard>
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
