import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';
import { useState } from 'react';

import AddPersonButton from 'features/events/components/AddPersonButton';
import EventDataModel from 'features/events/models/EventDataModel';
import EventLayout from 'features/events/layout/EventLayout';
import EventParticipantsFilter from 'features/events/components/EventParticipantsFilter';
import EventParticipantsList from 'features/events/components/EventParticipantsList';
import { PageWithLayout } from 'utils/types';
import ParticipantSummaryCard from 'features/events/components/ParticipantSummaryCard';
import { scaffold } from 'utils/next';
import useModel from 'core/useModel';
import ZUIFuture from 'zui/ZUIFuture';
import {
  ZetkinEventParticipant,
  ZetkinEventResponse,
} from 'utils/types/zetkin';

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
  const [isFilterCleared, setIsFilterCleared] = useState<boolean>(true);
  const [filteredParticipants, setFilteredParticipants] = useState<
    ZetkinEventParticipant[]
  >([]);
  const [filteredSignUp, setFilteredSignUp] = useState<ZetkinEventResponse[]>(
    []
  );
  const dataModel = useModel(
    (env) => new EventDataModel(env, parseInt(orgId), parseInt(eventId))
  );

  return (
    <ZUIFuture future={dataModel.getData()}>
      {(data) => {
        return (
          <>
            <Grid container spacing={2}>
              <Grid item md={8} xs={12}>
                <ParticipantSummaryCard model={dataModel} />
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
                model={dataModel}
                onFilterCleared={(value) => setIsFilterCleared(value)}
                onFilterParticipants={(list) => setFilteredParticipants(list)}
                onFilterSignUp={(list) => setFilteredSignUp(list)}
              />
              <AddPersonButton model={dataModel} />
            </Grid>
            <EventParticipantsList
              data={data}
              filterCleared={isFilterCleared}
              filteredParticipants={filteredParticipants}
              filteredSignUp={filteredSignUp}
              model={dataModel}
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
    <EventLayout
      campaignId={props.campId}
      eventId={props.eventId}
      orgId={props.orgId}
    >
      {page}
    </EventLayout>
  );
};

export default ParticipantsPage;
