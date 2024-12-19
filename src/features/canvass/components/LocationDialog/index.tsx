import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

import VisitWizard from './pages/VisitWizard';
import EditLocation from './pages/EditLocation';
import Location from './pages/Location';
import Household from './pages/Household';
import {
  ZetkinAreaAssignment,
  ZetkinLocation,
} from 'features/areaAssignments/types';
import ZUINavStack from 'zui/ZUINavStack';
import EditHousehold from './pages/EditHousehold';
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
  | 'wizard';

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
        <Location
          key="location"
          assignment={assignment}
          location={location}
          onClose={onClose}
          onEdit={() => goto('edit')}
          onHouseholds={() => goto('households')}
          onVisit={() => goto('locationVisit')}
        />
        <EditLocation
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
            <Household
              household={selectedHousehold}
              onBack={() => back()}
              onClose={onClose}
              onEdit={() => goto('editHousehold')}
              onWizardStart={() => {
                goto('wizard');
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
            <EditHousehold
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
        <Box key="wizard" height="100%">
          {selectedHousehold && (
            <VisitWizard
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
                back();
              }}
            />
          )}
        </Box>
      </ZUINavStack>
    </Box>
  );
};

export default LocationDialog;
