import { FC, useState } from 'react';
import { Box } from '@mui/material';

import VisitWizard from './pages/VisitWizard';
import EditPlace from './pages/EditPlace';
import Place from './pages/Place';
import Household from './pages/Household';
import ZUIFuture from 'zui/ZUIFuture';
import { ZetkinPlace } from 'features/canvassAssignments/types';
import usePlaceMutations from 'features/canvassAssignments/hooks/usePlaceMutations';
import useCanvassAssignment from 'features/canvassAssignments/hooks/useCanvassAssignment';
import ZUINavStack from 'zui/ZUINavStack';
import EditHousehold from './pages/EditHousehold';

type PlaceDialogProps = {
  canvassAssId: string;
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
  canvassAssId,
  onClose,
  orgId,
  place,
}) => {
  const [dialogStep, setDialogStep] = useState<PlaceDialogStep>('place');
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
                  setDialogStep('household');
                }}
                onEdit={() => setDialogStep('edit')}
                onSelectHousehold={(householdId: string) => {
                  setSelectedHouseholdId(householdId);
                  setDialogStep('household');
                }}
                orgId={orgId}
                place={place}
              />
              <EditPlace
                key="edit"
                onBack={() => setDialogStep('place')}
                onClose={onClose}
                onSave={async (title, description) => {
                  await updatePlace({ description, title });
                  setDialogStep('place');
                }}
                place={place}
              />
              <Box key="household" height="100%">
                {selectedHousehold && (
                  <Household
                    household={selectedHousehold}
                    onBack={() => setDialogStep('place')}
                    onClose={onClose}
                    onEdit={() => setDialogStep('editHousehold')}
                    onWizardStart={() => {
                      setDialogStep('wizard');
                    }}
                    visitedInThisAssignment={selectedHousehold.visits.some(
                      (visit) => visit.canvassAssId == canvassAssId
                    )}
                  />
                )}
              </Box>
              <Box key="editHousehold" height="100%">
                {selectedHousehold && (
                  <EditHousehold
                    household={selectedHousehold}
                    onBack={() => setDialogStep('household')}
                    onClose={onClose}
                    onSave={async (title) => {
                      await updateHousehold(selectedHousehold.id, { title });
                      setDialogStep('household');
                    }}
                  />
                )}
              </Box>
              <Box key="wizard" height="100%">
                {selectedHousehold && (
                  <VisitWizard
                    household={selectedHousehold}
                    metrics={assignment.metrics}
                    onBack={() => setDialogStep('household')}
                    onLogVisit={(responses, noteToOfficial) => {
                      addVisit(selectedHousehold.id, {
                        canvassAssId: assignment.id,
                        noteToOfficial,
                        responses,
                        timestamp: new Date().toISOString(),
                      });
                      setDialogStep('place');
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
