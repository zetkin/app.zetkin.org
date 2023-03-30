import { GetServerSideProps } from 'next';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';

import EventLayout from 'features/events/layout/EventLayout';

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
    localeScope: ['layout.organize.events', 'pages.organizeEvent'],
  }
);

interface EventPageProps {
  campId: string;
  eventId: string;
  orgId: string;
}

const EventPage: PageWithLayout<EventPageProps> = () => {
  return <>event page</>;
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
