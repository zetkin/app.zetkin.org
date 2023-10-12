import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';
import { useRef, useState } from 'react';

import AddPersonButton from 'features/events/components/AddPersonButton';
import EventContactCard from 'features/events/components/EventContactCard';
import EventLayout from 'features/events/layout/EventLayout';
import EventParticipantsFilter from 'features/events/components/EventParticipantsFilter';
import EventParticipantsList from 'features/events/components/EventParticipantsList';
import { PageWithLayout } from 'utils/types';
import ParticipantSummaryCard from 'features/events/components/ParticipantSummaryCard';
import { scaffold } from 'utils/next';
import useEventData from 'features/events/hooks/useEventData';
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

interface ParticipantsProps {
  campId: string;
  eventId: string;
  orgId: string;
}

const ParticipantsPage: PageWithLayout<ParticipantsProps> = ({
  eventId,
  orgId,
}) => {
  const [filterString, setFilterString] = useState<string>('');
  const listRef = useRef<HTMLDivElement>();
  const eventFuture = useEventData(parseInt(orgId), parseInt(eventId));

  return (
    <ZUIFuture future={eventFuture}>
      {(data) => {
        return (
          <>
            <Grid container spacing={2}>
              <Grid item md={8} xs={12}>
                <ParticipantSummaryCard
                  eventId={parseInt(eventId)}
                  onClickRecord={() => {
                    if (listRef.current) {
                      listRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  orgId={parseInt(orgId)}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <EventContactCard data={data} orgId={parseInt(orgId)} />
              </Grid>
            </Grid>
            <Grid
              container
              item
              justifyContent="flex-end"
              md={12}
              style={{ marginBottom: '40px', marginTop: '30px' }}
            >
              <EventParticipantsFilter
                onFilterChange={(value) => {
                  setFilterString(value);
                  if (listRef.current) {
                    listRef.current.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              />
              <AddPersonButton eventId={data.id} orgId={parseInt(orgId)} />
            </Grid>
            <EventParticipantsList
              ref={listRef}
              data={data}
              filterString={filterString}
              orgId={parseInt(orgId)}
            />
          </>
        );
      }}
    </ZUIFuture>
  );
};

ParticipantsPage.getLayout = function getLayout(page, props) {
  return (
    <EventLayout eventId={props.eventId} orgId={props.orgId}>
      {page}
    </EventLayout>
  );
};

export default ParticipantsPage;
