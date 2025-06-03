import { FC } from 'react';

import useLocation from 'features/areaAssignments/hooks/useLocation';
import MarkerIcon from './MarkerIcon';

type Props = {
  assignmentId: number;
  locationId: number;
  orgId: number;
  selected: boolean;
  uniqueKey?: string;
};

const LocationMarkerIcon: FC<Props> = ({
  assignmentId,
  locationId,
  orgId,
  selected,
  uniqueKey,
}) => {
  const locationFuture = useLocation(orgId, assignmentId, locationId);
  const location = locationFuture.data;

  return (
    <MarkerIcon
      selected={selected}
      successfulVisits={
        location?.num_households_successful ||
        location?.num_successful_visits ||
        0
      }
      totalHouseholds={Math.max(
        location?.num_estimated_households ?? 0,
        location?.num_known_households ?? 0
      )}
      totalVisits={
        location?.num_households_visited || location?.num_visits || 0
      }
      uniqueKey={uniqueKey}
    />
  );
};

export default LocationMarkerIcon;
