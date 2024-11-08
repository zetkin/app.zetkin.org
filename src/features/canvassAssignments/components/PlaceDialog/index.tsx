import { FC, useState } from 'react';
import { Box } from '@mui/material';

import VisitWizard from './pages/VisitWizard';
import EditPlace from './pages/EditPlace';
import Place from './pages/Place';
import Household from './pages/Household';
import ZUIFuture from 'zui/ZUIFuture';
import { PlaceDialogStep } from '../CanvassAssignmentMapOverlays';
import { ZetkinPlace } from 'features/canvassAssignments/types';
import usePlaceMutations from 'features/canvassAssignments/hooks/usePlaceMutations';
import useCanvassAssignment from 'features/canvassAssignments/hooks/useCanvassAssignment';
import ZUINavStack from 'zui/ZUINavStack';

type PlaceDialogProps = {
  canvassAssId: string;
  dialogStep: PlaceDialogStep;
  onClose: () => void;
  onEdit: () => void;
  onSelectHousehold: () => void;
  onUpdateDone: () => void;
  onWizard: () => void;
  orgId: number;
  place: ZetkinPlace;
};

const PlaceDialog: FC<PlaceDialogProps> = ({
  canvassAssId,
  dialogStep,
  onClose,
  onEdit,
  onUpdateDone,
  onSelectHousehold,
  onWizard,
  orgId,
  place,
}) => {
  const { addVisit, updateHousehold, updatePlace } = usePlaceMutations(
    orgId,
    place.id
  );
  const assignmentFuture = useCanvassAssignment(orgId, canvassAssId);

  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(
    null
  );

  const selectedHousehold = place.households.find(
    (household) => household.id == selectedHouseholdId
  );

  return (
    <Box height="100%">
      <ZUIFuture future={assignmentFuture}>
        {(assignment) => {
          return (
            <ZUINavStack bgcolor="white" currentPage={dialogStep}>
              <Place
                key="place"
                assignment={assignment}
                onClose={onClose}
                onCreateHousehold={(household) => {
                  setSelectedHouseholdId(household.id);
                  // TODO: Navigate using separate function
                  onSelectHousehold();
                }}
                onEdit={onEdit}
                onSelectHousehold={(householdId: string) => {
                  setSelectedHouseholdId(householdId);
                  onSelectHousehold();
                }}
                orgId={orgId}
                place={place}
              />
              <EditPlace
                key="edit"
                onBack={onUpdateDone}
                onClose={onClose}
                onSave={async (title, description) => {
                  await updatePlace({ description, title });
                  onUpdateDone();
                }}
                place={place}
              />
              <Box key="household" height="100%">
                {selectedHousehold && (
                  <Household
                    household={selectedHousehold}
                    onBack={onUpdateDone}
                    onClose={onClose}
                    onHouseholdUpdate={(data) =>
                      updateHousehold(selectedHousehold.id, data)
                    }
                    onWizardStart={() => {
                      onWizard();
                    }}
                    visitedInThisAssignment={selectedHousehold.visits.some(
                      (visit) => visit.canvassAssId == canvassAssId
                    )}
                  />
                )}
              </Box>
              <Box key="wizard" height="100%">
                {selectedHousehold && (
                  <VisitWizard
                    household={selectedHousehold}
                    metrics={assignment.metrics}
                    onBack={() => onSelectHousehold()}
                    onLogVisit={(responses, noteToOfficial) => {
                      addVisit(selectedHousehold.id, {
                        canvassAssId: assignment.id,
                        noteToOfficial,
                        responses,
                        timestamp: new Date().toISOString(),
                      });
                      onUpdateDone();
                    }}
                  />
                )}
              </Box>
            </ZUINavStack>
          );
        }}
      </ZUIFuture>
    </Box>
  );
};

export default PlaceDialog;
