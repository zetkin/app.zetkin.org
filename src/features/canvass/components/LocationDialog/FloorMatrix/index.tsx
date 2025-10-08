import { Box } from '@mui/material';
import { FC } from 'react';

import useHouseholds from 'features/canvass/hooks/useHouseholds';
import { HouseholdWithColor } from 'features/canvass/types';
import useVisitReporting from 'features/canvass/hooks/useVisitReporting';
import useAreaAssignmentMetrics from 'features/areaAssignments/hooks/useAreaAssignmentMetrics';
import FloorHouseholdGroup from './FloorHouseholdGroup';
import {
  ZetkinAreaAssignment,
  ZetkinLocation,
} from 'features/areaAssignments/types';

type Props = {
  assignment: ZetkinAreaAssignment;
  location: ZetkinLocation;
  onClickVisit: (householdId: number) => void;
  onSelectHousehold: (householdId: number) => void;
  onUpdateSelection: (selectedIds: number[] | null) => void;
  selectedHouseholdIds: number[] | null;
};

const FloorMatrix: FC<Props> = ({
  assignment,
  location,
  onClickVisit,
  onSelectHousehold,
  onUpdateSelection,
  selectedHouseholdIds,
}) => {
  const households = useHouseholds(location.organization_id, location.id);

  const metrics = useAreaAssignmentMetrics(
    location.organization_id,
    assignment.id
  );

  const { lastVisitByHouseholdId } = useVisitReporting(
    location.organization_id,
    assignment.id,
    location.id
  );

  const sortedHouseholds = households.concat().sort((h0, h1) => {
    const floor0 = h0.level ?? Infinity;
    const floor1 = h1.level ?? Infinity;

    if (floor0 == floor1) {
      return h0.title.localeCompare(h1.title);
    }

    return floor0 - floor1;
  });

  const successMetric = metrics?.find((m) => m.defines_success);

  const householdsByFloor = sortedHouseholds.reduce(
    (floors: Record<number, HouseholdWithColor[]>, household) => {
      return {
        ...floors,
        [household.level]: [...(floors[household.level] || []), household],
      };
    },
    {}
  );
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
      }}
    >
      {Object.keys(householdsByFloor)
        .map((floorStr) => parseInt(floorStr))
        .sort()
        .reverse()
        .map((floor) => {
          const householdsOnFloor = householdsByFloor[floor];

          return (
            <FloorHouseholdGroup
              key={floor}
              floor={floor}
              householdItems={householdsOnFloor.map((household) => {
                const mostRecentVisit = lastVisitByHouseholdId[household.id];

                const lastVisitSuccess =
                  !!mostRecentVisit &&
                  !!successMetric &&
                  mostRecentVisit.metrics.some(
                    (metric) =>
                      metric.metric_id == successMetric.id &&
                      metric.response == 'yes'
                  );

                return {
                  household,
                  lastVisitSuccess,
                  lastVisitTime: mostRecentVisit?.created ?? null,
                };
              })}
              onClick={(householdId) => onSelectHousehold(householdId)}
              onClickVisit={(householdId) => onClickVisit(householdId)}
              onDeselectIds={(ids) =>
                onUpdateSelection(
                  selectedHouseholdIds?.filter((id) => !ids.includes(id)) ??
                    null
                )
              }
              onSelectIds={(ids) =>
                onUpdateSelection([...(selectedHouseholdIds || []), ...ids])
              }
              selectedIds={selectedHouseholdIds}
            />
          );
        })}
    </Box>
  );
};

export default FloorMatrix;
