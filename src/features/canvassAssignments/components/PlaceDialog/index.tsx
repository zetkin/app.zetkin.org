import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

import VisitWizard from './pages/VisitWizard';
import EditPlace from './pages/EditPlace';
import Place from './pages/Place';
import Household from './pages/Household';
import {
  ZetkinCanvassAssignment,
  ZetkinPlace,
} from 'features/canvassAssignments/types';
import usePlaceMutations from 'features/canvassAssignments/hooks/usePlaceMutations';
import ZUINavStack from 'zui/ZUINavStack';
import EditHousehold from './pages/EditHousehold';

type PlaceDialogProps = {
  assignment: ZetkinCanvassAssignment;
  onClose: () => void;
  orgId: number;
  place: ZetkinPlace;
};

type PlaceDialogStep =
  | 'place'
  | 'edit'
  | 'household'
  | 'editHousehold'
  | 'wizard';

const PlaceDialog: FC<PlaceDialogProps> = ({
  assignment,
  onClose,
  orgId,
  place,
}) => {
  const [dialogStep, setDialogStep] = useState<PlaceDialogStep>('place');
  const { addVisit, updateHousehold, updatePlace } = usePlaceMutations(
    orgId,
    place.id
  );

  const pushedRef = useRef(false);

  const goto = useCallback(
    (step: PlaceDialogStep) => {
      setDialogStep(step);
      history.pushState({ step: step }, '', `?step=${step}`);
    },
    [setDialogStep]
  );

  const back = useCallback(() => {
    history.back();
  }, [setDialogStep]);

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
      goto('place');
    }
  }, []);

  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(
    null
  );

  const selectedHousehold = place.households.find(
    (household) => household.id == selectedHouseholdId
  );

  return (
    <Box height="100%">
      <ZUINavStack bgcolor="white" currentPage={dialogStep}>
        <Place
          key="place"
          assignment={assignment}
          onClose={onClose}
          onCreateHousehold={(household) => {
            setSelectedHouseholdId(household.id);
            goto('household');
          }}
          onEdit={() => goto('edit')}
          onSelectHousehold={(householdId: string) => {
            setSelectedHouseholdId(householdId);
            goto('household');
          }}
          orgId={orgId}
          place={place}
        />
        <EditPlace
          key="edit"
          onBack={() => back()}
          onClose={onClose}
          onSave={async (title, description) => {
            await updatePlace({ description, title });
            goto('place');
          }}
          place={place}
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
                (visit) => visit.canvassAssId == assignment.id
              )}
            />
          )}
        </Box>
        <Box key="editHousehold" height="100%">
          {selectedHousehold && (
            <EditHousehold
              household={selectedHousehold}
              onBack={() => back()}
              onClose={onClose}
              onSave={async (title) => {
                await updateHousehold(selectedHousehold.id, { title });
                goto('household');
              }}
            />
          )}
        </Box>
        <Box key="wizard" height="100%">
          {selectedHousehold && (
            <VisitWizard
              household={selectedHousehold}
              metrics={assignment.metrics}
              onBack={() => back()}
              onLogVisit={(responses, noteToOfficial) => {
                addVisit(selectedHousehold.id, {
                  canvassAssId: assignment.id,
                  noteToOfficial,
                  responses,
                  timestamp: new Date().toISOString(),
                });
                goto('place');
              }}
            />
          )}
        </Box>
      </ZUINavStack>
    </Box>
  );
};

export default PlaceDialog;
