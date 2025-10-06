import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import PageBase from './PageBase';
import {
  ZetkinAreaAssignment,
  ZetkinLocation,
} from 'features/areaAssignments/types';
import messageIds from 'features/canvass/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import useHouseholds from 'features/canvass/hooks/useHouseholds';
import { HouseholdWithColor } from 'features/canvass/types';
import useVisitReporting from 'features/canvass/hooks/useVisitReporting';
import useAreaAssignmentMetrics from 'features/areaAssignments/hooks/useAreaAssignmentMetrics';
import FloorHouseholdGroup from '../FloorHouseholdGroup';

type Props = {
  assignment: ZetkinAreaAssignment;
  location: ZetkinLocation;
  onBack: () => void;
  onClose: () => void;
  onSelectHousehold: (householdId: number) => void;
};

const HouseholdsPage2: FC<Props> = ({
  assignment,
  onBack,
  onClose,
  onSelectHousehold,
  location,
}) => {
  const messages = useMessages(messageIds);
  const households = useHouseholds(location.organization_id, location.id);
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

  const metrics = useAreaAssignmentMetrics(
    location.organization_id,
    assignment.id
  );

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
    <PageBase
      onBack={onBack}
      onClose={onClose}
      subtitle={location.title}
      title={messages.households.page.header()}
    >
      <Box display="flex" flexDirection="column" flexGrow={2}>
        {location.num_known_households == 0 && (
          <Typography color="secondary" sx={{ fontStyle: 'italic' }}>
            <Msg id={messageIds.households.page.empty} />
          </Typography>
        )}
        <Box>
          {Object.keys(householdsByFloor)
            .map((floorStr) => parseInt(floorStr))
            .sort()
            .reverse()
            .map((floor) => {
              const householdsOnFloor = householdsByFloor[floor];

              return (
                <FloorHouseholdGroup
                  key={floor}
                  householdItems={householdsOnFloor.map((household) => {
                    const mostRecentVisit =
                      lastVisitByHouseholdId[household.id];

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
                />
              );
            })}
        </Box>
      </Box>
    </PageBase>
  );
};

export default HouseholdsPage2;
