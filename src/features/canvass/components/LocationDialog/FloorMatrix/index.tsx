import { Box } from '@mui/material';
import { range } from 'lodash';
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
import FloorEditor from './FloorEditor';
import { EditedFloor } from './types';
import AddFloorButton from './AddFloorButton';
import useIsMobile from 'utils/hooks/useIsMobile';

const naturalCmp = new Intl.Collator(undefined, { numeric: true }).compare;

type Props = {
  assignment: ZetkinAreaAssignment;
  draftFloors: EditedFloor[] | null;
  location: ZetkinLocation;
  onClickDetails: (householdId: number) => void;
  onClickVisit: (householdId: number) => void;
  onEditChange: (floors: EditedFloor[]) => void;
  onSelectHousehold: (householdId: number) => void;
  onUpdateSelection: (selectedIds: number[] | null) => void;
  selectedHouseholdIds: number[] | null;
};

const FloorMatrix: FC<Props> = ({
  assignment,
  draftFloors,
  location,
  onClickDetails,
  onClickVisit,
  onEditChange,
  onSelectHousehold,
  onUpdateSelection,
  selectedHouseholdIds,
}) => {
  const households = useHouseholds(location.organization_id, location.id);
  const isMobile = useIsMobile();

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
      return naturalCmp(h0.title, h1.title);
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

  const floorLevels = [
    ...(draftFloors?.map((floor) => floor.level) || []),
    ...households.map((household) => household.level),
  ];

  const hasFloors = !!floorLevels.length;
  if (!hasFloors) {
    return null;
  }

  const minLevel = Math.min(...floorLevels);
  const maxLevel = Math.max(...floorLevels);
  const editing = !!draftFloors;
  const selecting = !!selectedHouseholdIds;

  const hasOnlyLevelZero = minLevel == 0 && maxLevel == 0;
  const unlikelyToBeSingleFloorInRealLife = households.length > 8;
  const householdsLikelyCreatedWithoutFloors =
    hasOnlyLevelZero && unlikelyToBeSingleFloorInRealLife;
  const shouldStartExpanded = householdsLikelyCreatedWithoutFloors || !isMobile;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {!selecting && (
        <AddFloorButton
          label="Add floor above"
          nextLevel={maxLevel + 1}
          onClick={() => {
            const lastDraft = draftFloors?.find(
              (draft) => draft.level == maxLevel
            );

            const lastLevelHouseholds = households.filter(
              (household) => household.level == maxLevel
            );

            const numDraftsOnLastLevel = lastDraft?.draftHouseholdCount ?? 0;
            const numHouseholdsOnLastLevel =
              numDraftsOnLastLevel + lastLevelHouseholds.length;

            const newFloor: EditedFloor = {
              draftHouseholdCount: numHouseholdsOnLastLevel,
              existingHouseholds: [],
              level: maxLevel + 1,
            };

            onEditChange([...(draftFloors || []), newFloor]);
          }}
        />
      )}
      {range(minLevel, maxLevel + 1)
        .reverse()
        .map((floor, thisFloorIndex) => {
          const householdsOnFloor = householdsByFloor[floor] || [];
          const draftFloor = draftFloors?.find((draft) => draft.level == floor);

          const hasNoHouseholdsFromBefore = households.length == 0;
          const isBottomFloor = floor == minLevel;
          const isInitialFloor = isBottomFloor && hasNoHouseholdsFromBefore;

          if (editing) {
            return (
              <FloorEditor
                key={floor}
                draft={
                  draftFloor || {
                    draftHouseholdCount: 0,
                    existingHouseholds: householdsOnFloor,
                    level: floor,
                  }
                }
                levelEnabled={isInitialFloor}
                onChange={(newDraft) => {
                  onEditChange([
                    ...draftFloors.filter(
                      (oldDraft) => newDraft.level != oldDraft.level
                    ),
                    newDraft,
                  ]);
                }}
                onDelete={() =>
                  onEditChange(
                    draftFloors.filter((oldDraft) => oldDraft.level != floor)
                  )
                }
                onLevelChange={(newLevel) => {
                  onEditChange(
                    draftFloors.map((oldDraft, oldDraftIndex) => {
                      const diff = oldDraftIndex - thisFloorIndex;
                      const offsetLevel = newLevel - diff;
                      return {
                        ...oldDraft,
                        level: offsetLevel,
                      };
                    })
                  );
                }}
              />
            );
          } else {
            const householdItems = householdsOnFloor.map((household) => {
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
            });

            return (
              <FloorHouseholdGroup
                key={floor}
                floor={floor}
                householdItems={householdItems}
                initialExpanded={shouldStartExpanded}
                onClick={(householdId) => onSelectHousehold(householdId)}
                onClickDetails={(householdId) => onClickDetails(householdId)}
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
          }
        })}
      {!selecting && (
        <AddFloorButton
          label="Add floor below"
          nextLevel={minLevel - 1}
          onClick={() => {
            const lastDraft = draftFloors?.find(
              (draft) => draft.level == minLevel
            );

            const lastLevelHouseholds = households.filter(
              (household) => household.level == minLevel
            );
            const numDraftsOnLastLevel = lastDraft?.draftHouseholdCount ?? 0;
            const numHouseholdsOnLastLevel =
              numDraftsOnLastLevel + lastLevelHouseholds.length;

            const newFloor: EditedFloor = {
              draftHouseholdCount: numHouseholdsOnLastLevel,
              existingHouseholds: [],
              level: minLevel - 1,
            };

            onEditChange([...(draftFloors || []), newFloor]);
          }}
        />
      )}
    </Box>
  );
};

export default FloorMatrix;
