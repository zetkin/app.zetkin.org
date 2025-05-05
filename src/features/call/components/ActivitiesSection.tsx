import { FC } from 'react';
import { Box } from '@mui/material';

import EventCard from './EventCard';
import useActiveEvents from '../hooks/useActiveEvents';
import ZUISection from 'zui/components/ZUISection';
import { ZetkinCallTarget } from '../types';
import { ZetkinCallAssignment } from 'utils/types/zetkin';

type ActivitiesSectionProps = {
  assignment: ZetkinCallAssignment;
  target: ZetkinCallTarget;
};

const ActivitiesSection: FC<ActivitiesSectionProps> = ({
  assignment,
  target,
}) => {
  const events = useActiveEvents(assignment.organization.id, target.id);

  return (
    <ZUISection
      renderContent={() => (
        <Box display="flex" flexDirection="column" gap={1}>
          {events.map((event, index) => (
            <EventCard key={index} event={event} target={target} />
          ))}
        </Box>
      )}
      subtitle={`Acting as ${target.first_name}`}
      title="Activities"
    />
  );
};

export default ActivitiesSection;
