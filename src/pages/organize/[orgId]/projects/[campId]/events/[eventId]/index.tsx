import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';

import EventLayout from 'features/events/layout/EventLayout';
import ZUIEventDetailsCard from 'zui/ZUIEventDetailsCard';

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

const EventPage: PageWithLayout<EventPageProps> = () => {
  return (
    <Grid container spacing={1}>
      <Grid item sm={8}>
        <ZUIEventDetailsCard></ZUIEventDetailsCard>
      </Grid>
    </Grid>
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
