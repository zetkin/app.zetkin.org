import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

import HouseholdVisitPage from './pages/HouseholdVisitPage';
import EditLocationPage from './pages/EditLocationPage';
import LocationPage from './pages/LocationPage';
import HouseholdPage from './pages/HouseholdPage';
import {
  ZetkinAreaAssignment,
  ZetkinLocation,
} from 'features/areaAssignments/types';
import ZUINavStack from 'zui/ZUINavStack';
import EditHouseholdPage from './pages/EditHouseholdPage';
import CreateHouseholdsPage from './pages/CreateHouseholdsPage';
import LocationVisitPage from './pages/LocationVisitPage';
import HouseholdsPage from './pages/HouseholdsPage';
import useLocationMutations from 'features/canvass/hooks/useLocationMutations';
import EncouragingSparkle from '../EncouragingSparkle';
import useAreaAssignmentMetrics from 'features/areaAssignments/hooks/useAreaAssignmentMetrics';
import estimateVisitedHouseholds from 'features/canvass/utils/estimateVisitedHouseholds';
import { ZetkinLocationVisit } from 'features/canvass/types';
import useVisitReporting from 'features/canvass/hooks/useVisitReporting';
import sortMetrics from 'features/canvass/utils/sortMetrics';
import BulkHouseholdVisitsPage from './pages/BulkHouseholdVisitsPage';
import BulkEditHouseholdsPage from './pages/BulkEditHouseholdsPage';
import useEditHouseholds from 'features/canvass/hooks/useEditHouseholds';
import HouseholdsPage2 from './pages/HouseholdsPage2';

type LocationDialogProps = {
  assignment: ZetkinAreaAssignment;
  location: ZetkinLocation;
  onClose: () => void;
  orgId: number;
};

type LocationDialogStep =
  | 'location'
  | 'edit'
  | 'createHouseholds'
  | 'households'
  | 'households2'
  | 'household'
  | 'editHousehold'
  | 'locationVisit'
  | 'householdVisit'
  | 'bulkHouseholdVisits'
  | 'bulkEditHouseholds';

const LocationDialog: FC<LocationDialogProps> = ({
  assignment,
  onClose,
  orgId,
  location,
}) => {
  const [dialogStep, setDialogStep] = useState<LocationDialogStep>('location');
  const [showSparkle, setShowSparkle] = useState(false);
  const metricsList = useAreaAssignmentMetrics(
    assignment.organization_id,
    assignment.id
  );
  const metrics = sortMetrics(metricsList);
  const { updateHousehold, updateLocation } = useLocationMutations(
    orgId,
    location.id
  );
  const {
    lastVisitByHouseholdId,
    reportHouseholdVisit,
    reportHouseholdVisits,
    reportLocationVisit,
  } = useVisitReporting(orgId, assignment.id, location.id);
  const editHouseholds = useEditHouseholds(orgId, location.id);

  const pushedRef = useRef(false);

  const goto = useCallback(
    (step: LocationDialogStep) => {
      setDialogStep(step);
      history.pushState({ step: step }, '', `?step=${step}`);
    },
    [setDialogStep]
  );

  const back = useCallback(() => {
    history.back();
  }, []);

  useEffect(() => {
    function handlePopState(event: PopStateEvent) {
      if (event.state.step) {
        setDialogStep(event.state.step);
      } else {
        onClose();
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, []);

  useEffect(() => {
    if (!pushedRef.current) {
      pushedRef.current = true;
      goto('location');
    }
  }, []);

  const [selectedHouseholdId, setSelectedHouseholdId] = useState<number | null>(
    null
  );
  const [selectedHouseholdIds, setSelectedHouseholdIds] = useState<number[]>(
    []
  );

  return (
    <Box height="100%">
      {showSparkle && (
        <EncouragingSparkle onComplete={() => setShowSparkle(false)} />
      )}
      <ZUINavStack bgcolor="white" currentPage={dialogStep}>
        <LocationPage
          key="location"
          assignment={assignment}
          location={location}
          onClose={onClose}
          onEdit={() => goto('edit')}
          onHouseholds={(useNew) => goto(useNew ? 'households2' : 'households')}
          onVisit={() => goto('locationVisit')}
        />
        <EditLocationPage
          key="edit"
          location={location}
          onBack={() => back()}
          onClose={onClose}
          onSave={async (title, description) => {
            await updateLocation({ description, title });
            back();
          }}
        />
        <HouseholdsPage2
          key="households2"
          assignment={assignment}
          location={location}
          onBack={() => back()}
          onBulkEdit={(householdIds) => {
            setSelectedHouseholdIds(householdIds);
            goto('bulkEditHouseholds');
          }}
          onBulkVisit={(households) => {
            setSelectedHouseholdIds(households);
            goto('bulkHouseholdVisits');
          }}
          onClose={onClose}
          onSelectHousehold={(householdId: number) => {
            setSelectedHouseholdId(householdId);
            goto('household');
          }}
        />
        <HouseholdsPage
          key="households"
          assignment={assignment}
          location={location}
          onBack={() => back()}
          onBulkCreate={() => goto('createHouseholds')}
          onBulkEdit={(householdIds) => {
            setSelectedHouseholdIds(householdIds);
            goto('bulkEditHouseholds');
          }}
          onBulkVisit={(households) => {
            setSelectedHouseholdIds(households);
            goto('bulkHouseholdVisits');
          }}
          onClose={onClose}
          onCreateHousehold={(household) => {
            setSelectedHouseholdId(household.id);
            goto('household');
          }}
          onSelectHousehold={(householdId: number) => {
            setSelectedHouseholdId(householdId);
            goto('household');
          }}
          onSelectHouseholds={(householdIds: number[]) =>
            setSelectedHouseholdIds(householdIds)
          }
          selectedHouseholdIds={selectedHouseholdIds}
        />
        <Box key="household" height="100%">
          {selectedHouseholdId && (
            <HouseholdPage
              householdId={selectedHouseholdId}
              location={location}
              onBack={() => back()}
              onClose={onClose}
              onEdit={() => goto('editHousehold')}
              onHouseholdVisitStart={() => {
                goto('householdVisit');
              }}
              visitedInThisAssignment={
                !!lastVisitByHouseholdId[selectedHouseholdId]
              }
            />
          )}
        </Box>
        <Box key="createHouseholds" height="100%">
          <CreateHouseholdsPage
            location={location}
            onBack={() => back()}
            onClose={onClose}
            orgId={orgId}
          />
        </Box>
        <Box key="editHousehold" height="100%">
          {selectedHouseholdId && (
            <EditHouseholdPage
              householdId={selectedHouseholdId}
              location={location}
              onBack={() => back()}
              onClose={onClose}
              onSave={async (title, level, color) => {
                if (selectedHouseholdId) {
                  await updateHousehold(selectedHouseholdId, {
                    color,
                    level,
                    title,
                  });
                  back();
                }
              }}
            />
          )}
        </Box>
        <Box key="locationVisit" height="100%">
          <LocationVisitPage
            active={dialogStep == 'locationVisit'}
            assignment={assignment}
            onBack={() => back()}
            onClose={onClose}
            onLogVisit={async (responses) => {
              // TODO: User should specify household count
              const numHouseholds = estimateVisitedHouseholds({
                metrics: responses,
              } as ZetkinLocationVisit);

              await reportLocationVisit(numHouseholds, responses);
              setShowSparkle(true);
            }}
          />
        </Box>
        <Box key="householdVisit" height="100%">
          {selectedHouseholdId && (
            <HouseholdVisitPage
              householdId={selectedHouseholdId}
              location={location}
              metrics={metrics}
              onBack={() => back()}
              onLogVisit={async (responses) => {
                await reportHouseholdVisit(selectedHouseholdId, responses);
                setShowSparkle(true);
                goto('households');
              }}
            />
          )}
        </Box>
        <Box key="bulkHouseholdVisits" height="100%">
          {selectedHouseholdIds.length > 0 && (
            <BulkHouseholdVisitsPage
              metrics={metrics}
              onBack={() => back()}
              onLogVisit={async (responses) => {
                await reportHouseholdVisits(selectedHouseholdIds, responses);
                setShowSparkle(true);
                setSelectedHouseholdIds([]);
                back();
              }}
              selectedHouseholsdIds={selectedHouseholdIds}
            />
          )}
        </Box>
        <Box key="bulkEditHouseholds" height="100%">
          {selectedHouseholdIds.length > 0 && (
            <BulkEditHouseholdsPage
              householdIds={selectedHouseholdIds}
              onBack={() => back()}
              onSave={async (updates) => {
                await editHouseholds(selectedHouseholdIds, updates);
                setSelectedHouseholdIds([]);
                goto('households');
              }}
            />
          )}
        </Box>
      </ZUINavStack>
    </Box>
  );
};

export default LocationDialog;
