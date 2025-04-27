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
  | 'household'
  | 'editHousehold'
  | 'locationVisit'
  | 'householdVisit';

const LocationDialog: FC<LocationDialogProps> = ({
  assignment,
  onClose,
  orgId,
  location,
}) => {
  const [dialogStep, setDialogStep] = useState<LocationDialogStep>('location');
  const [showSparkle, setShowSparkle] = useState(false);
  const { addVisit, reportLocationVisit, updateHousehold, updateLocation } =
    useLocationMutations(orgId, location.id);

  const pushedRef = useRef(false);

  const goto = useCallback(
    (step: LocationDialogStep) => {
      setDialogStep(step);
      history.pushState(
        { previousStep: dialogStep, step },
        '',
        `?step=${step}`
      );
    },
    [setDialogStep, dialogStep]
  );

  const back = useCallback((stepsToGoBack = 1) => {
    history.go(-stepsToGoBack);
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

  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(
    null
  );

  const selectedHousehold = location.households.find(
    (household) => household.id == selectedHouseholdId
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
          onHouseholds={() => goto('households')}
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
        <HouseholdsPage
          key="households"
          location={location}
          onBack={() => back()}
          onBulk={() => goto('createHouseholds')}
          onClose={onClose}
          onCreateHousehold={(household) => {
            setSelectedHouseholdId(household.id);
            goto('household');
          }}
          onSelectHousehold={(householdId: string) => {
            setSelectedHouseholdId(householdId);
            goto('household');
          }}
          orgId={orgId}
        />
        <Box key="household" height="100%">
          {selectedHousehold && (
            <HouseholdPage
              household={selectedHousehold}
              onBack={() => back()}
              onClose={onClose}
              onEdit={() => goto('editHousehold')}
              onHouseholdVisitStart={() => {
                goto('householdVisit');
              }}
              visitedInThisAssignment={selectedHousehold.visits.some(
                (visit) => visit.areaAssId == assignment.id
              )}
            />
          )}
        </Box>
        <Box key="createHouseholds" height="100%">
          <CreateHouseholdsPage
            locationId={location.id}
            onBack={() => back()}
            onClose={onClose}
            orgId={orgId}
          />
        </Box>
        <Box key="editHousehold" height="100%">
          {selectedHousehold && (
            <EditHouseholdPage
              household={selectedHousehold}
              onBack={() => back()}
              onClose={onClose}
              onSave={async (title, floor) => {
                await updateHousehold(selectedHousehold.id, { floor, title });
                back();
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
              await reportLocationVisit(assignment.id, {
                areaAssId: assignment.id,
                locationId: location.id,
                responses,
              });
              setShowSparkle(true);
            }}
          />
        </Box>
        <Box key="householdVisit" height="100%">
          {selectedHousehold && (
            <HouseholdVisitPage
              household={selectedHousehold}
              metrics={assignment.metrics}
              onBack={() => back()}
              onLogVisit={async (responses, noteToOfficial) => {
                await addVisit(selectedHousehold.id, {
                  areaAssId: assignment.id,
                  noteToOfficial,
                  responses,
                  timestamp: new Date().toISOString(),
                });
                setShowSparkle(true);

                // Generally, we want to back 2 steps, to the `households` step.
                // But in case the user can end up here from another route in the future, we don't want to always
                // back 2 steps, since that could back too far. So we have this check with a fallback behavior.
                if (
                  'previousStep' in history.state &&
                  history.state.previousStep === 'household'
                ) {
                  back(2);
                } else {
                  back();
                }
              }}
            />
          )}
        </Box>
      </ZUINavStack>
    </Box>
  );
};

export default LocationDialog;
