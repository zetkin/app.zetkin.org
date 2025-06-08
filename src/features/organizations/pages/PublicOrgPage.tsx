'use client';

import { FC, useMemo } from 'react';

import AllEventsList from '../../home/components/AllEventsList';
import useUpcomingOrgEvents from '../hooks/useUpcomingOrgEvents';
import { ZetkinEventWithStatus } from '../../home/types';
import useMyEvents from 'features/events/hooks/useMyEvents';

type Props = {
  orgId: number;
};

const PublicOrgPage: FC<Props> = ({ orgId }) => {
  const orgEvents = useUpcomingOrgEvents(orgId);
  const myEvents = useMyEvents();
  const allEvents = useMemo(() => {
    return orgEvents.map<ZetkinEventWithStatus>((event) => ({
      ...event,
      status:
        myEvents.find((userEvent) => userEvent.id == event.id)?.status || null,
    }));
  }, [orgEvents]);

  return <AllEventsList events={allEvents} orgId={orgId} />;
};

export default PublicOrgPage;
