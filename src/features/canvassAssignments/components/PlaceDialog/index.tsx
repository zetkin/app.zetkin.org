import { ArrowBackIos, Close } from '@mui/icons-material';
import { FC, useState } from 'react';
import { Box, Divider, IconButton, Typography } from '@mui/material';

import VisitWizard from './VisitWizard';
import EditPlace from './pages/EditPlace';
import Place from './pages/Place';
import Household from './pages/Household';
import ZUIFuture from 'zui/ZUIFuture';
import { PlaceDialogStep } from '../CanvassAssignmentMapOverlays';
import { ZetkinPlace } from 'features/canvassAssignments/types';
import usePlaceMutations from 'features/canvassAssignments/hooks/usePlaceMutations';
import useCanvassAssignment from 'features/canvassAssignments/hooks/useCanvassAssignment';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';

type PlaceDialogProps = {
  canvassAssId: string;
  dialogStep: PlaceDialogStep;
  onClose: () => void;
  onEdit: () => void;
  onPickHousehold: () => void;
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
  onPickHousehold,
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

  /*const sortedVisits =
    selectedHousehold?.visits.toSorted((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      if (dateA > dateB) {
        return -1;
      } else if (dateB > dateA) {
        return 1;
      } else {
        return 0;
      }
    }) || [];*/

  const showWizard = selectedHousehold && dialogStep == 'wizard';

  return (
    <Box>
      <ZUIFuture future={assignmentFuture}>
        {(assignment) => {
          if (dialogStep == 'place') {
            return (
              <Place
                onClose={onClose}
                onCreateHousehold={(household) => {
                  setSelectedHouseholdId(household.id);
                  // TODO: Navigate using separate function
                  onSelectHousehold();
                }}
                onEdit={onEdit}
                onNavigate={(step) => {
                  // TODO: Clean this up, no need for separate functions
                  if (step == 'wizard') {
                    onWizard();
                  } else if (step == 'pickHousehold') {
                    onPickHousehold();
                  }
                }}
                onSelectHousehold={(householdId: string) => {
                  setSelectedHouseholdId(householdId);
                  onSelectHousehold();
                }}
                orgId={orgId}
                place={place}
              />
            );
          } else if (dialogStep == 'edit') {
            return (
              <EditPlace
                onBack={onUpdateDone}
                onClose={onClose}
                onSave={async (title, description) => {
                  await updatePlace({ description, title });
                  onUpdateDone();
                }}
                place={place}
              />
            );
          } else if (dialogStep == 'household') {
            if (!selectedHousehold) {
              // This never seems to happen, which is correct
              return null;
            }

            return (
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
            );
          }

          return (
            <Box display="flex" flexDirection="column">
              <Box
                paddingBottom={1}
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                {dialogStep == 'pickHousehold' && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Box alignItems="center" display="flex">
                      <IconButton
                        onClick={() => {
                          onUpdateDone();
                        }}
                      >
                        <ArrowBackIos />
                      </IconButton>
                      <Typography variant="h6">Pick household</Typography>
                    </Box>
                    <IconButton onClick={onClose}>
                      <Close />
                    </IconButton>
                  </Box>
                )}
                {dialogStep == 'wizard' && selectedHousehold && (
                  <Box alignItems="center" display="flex">
                    <IconButton
                      onClick={() => {
                        onSelectHousehold();
                      }}
                    >
                      <ArrowBackIos />
                    </IconButton>
                    <Typography alignItems="center" display="flex" variant="h6">
                      {selectedHousehold.title || 'Untitled household'}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Divider />
              <Box flexGrow={1} overflow="hidden">
                {dialogStep == 'pickHousehold' && (
                  <Box
                    display="flex"
                    flexDirection="column"
                    flexGrow={2}
                    gap={1}
                    overflow="hidden"
                    paddingTop={1}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap={2}
                      sx={{ overflowY: 'auto' }}
                    >
                      {place.households.map((household) => {
                        const sortedVisits = household.visits.toSorted(
                          (a, b) => {
                            const dateA = new Date(a.timestamp);
                            const dateB = new Date(b.timestamp);
                            if (dateA > dateB) {
                              return -1;
                            } else if (dateB > dateA) {
                              return 1;
                            } else {
                              return 0;
                            }
                          }
                        );

                        const mostRecentVisit =
                          sortedVisits.length > 0 ? sortedVisits[0] : null;

                        return (
                          <Box
                            key={household.id}
                            alignItems="center"
                            display="flex"
                            onClick={() => {
                              setSelectedHouseholdId(household.id);
                              onWizard();
                            }}
                            width="100%"
                          >
                            <Box flexGrow={1}>
                              <Typography>
                                {household.title || 'Untitled household'}
                              </Typography>
                            </Box>
                            {mostRecentVisit && (
                              <ZUIRelativeTime
                                datetime={mostRecentVisit.timestamp}
                              />
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}
                {showWizard && (
                  <VisitWizard
                    metrics={assignment.metrics}
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
            </Box>
          );
        }}
      </ZUIFuture>
    </Box>
  );
};

export default PlaceDialog;
