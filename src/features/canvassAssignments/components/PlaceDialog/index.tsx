import { ArrowBackIos, Close, Edit, MoreVert } from '@mui/icons-material';
import { FC, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';

import VisitWizard from './VisitWizard';
import EditPlace from './EditPlace';
import Place from './Place';
import Household from './Household';
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
  const { addVisit, addHousehold, updateHousehold, updatePlace } =
    usePlaceMutations(orgId, place.id);
  const assignmentFuture = useCanvassAssignment(orgId, canvassAssId);

  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(
    null
  );
  const [description, setDescription] = useState<string>(
    place.description ?? ''
  );
  const [title, setTitle] = useState<string>(place.title ?? '');
  const [editingHouseholdTitle, setEditingHouseholdTitle] = useState(false);
  const [householdTitle, setHousholdTitle] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

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

  const nothingHasBeenEdited =
    dialogStep == 'edit' &&
    title == place.title &&
    (description == place.description || (!description && !place.description));

  const saveButtonDisabled = nothingHasBeenEdited;

  const showWizard = selectedHousehold && dialogStep == 'wizard';

  return (
    <Box>
      <ZUIFuture future={assignmentFuture}>
        {(assignment) => {
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
                {dialogStep == 'place' && (
                  <>
                    <Typography alignItems="center" display="flex" variant="h6">
                      {place?.title || 'Untitled place'}
                    </Typography>
                    <Box>
                      <IconButton onClick={onEdit}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={onClose}>
                        <Close />
                      </IconButton>
                    </Box>
                  </>
                )}
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
                {dialogStep == 'edit' && (
                  <>
                    <Typography variant="h6">
                      {`Edit ${place.title || 'Untitled place'}`}
                    </Typography>
                    <IconButton onClick={onUpdateDone}>
                      <Close />
                    </IconButton>
                  </>
                )}
                {dialogStep == 'household' && selectedHousehold && (
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
                      <Typography
                        alignItems="center"
                        display="flex"
                        variant="h6"
                      >
                        {selectedHousehold.title || 'Untitled household'}
                      </Typography>
                    </Box>
                    <Box alignItems="center" display="flex">
                      <IconButton
                        onClick={() => {
                          setHousholdTitle(selectedHousehold.title);
                          setEditingHouseholdTitle(true);
                        }}
                        sx={{ marginRight: 1 }}
                      >
                        <Edit />
                      </IconButton>
                    </Box>
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
                {place && dialogStep == 'place' && (
                  <Place
                    onSelectHousehold={(householdId: string) => {
                      setSelectedHouseholdId(householdId);
                      onSelectHousehold();
                    }}
                    place={place}
                  />
                )}
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
                {dialogStep === 'edit' && (
                  <EditPlace
                    description={description}
                    onDescriptionChange={(newDescription) =>
                      setDescription(newDescription)
                    }
                    onTitleChange={(newTitle) => setTitle(newTitle)}
                    title={title}
                  />
                )}
                {selectedHousehold && dialogStep == 'household' && (
                  <Household
                    editingHouseholdTitle={editingHouseholdTitle}
                    householdTitle={householdTitle}
                    onEditHouseholdTitleEnd={() =>
                      setEditingHouseholdTitle(false)
                    }
                    onHouseholdTitleChange={(newTitle) =>
                      setHousholdTitle(newTitle)
                    }
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
              <Box
                display="flex"
                gap={1}
                justifyContent="center"
                paddingTop={1}
              >
                {dialogStep === 'place' && place.households.length == 0 && (
                  <Button
                    fullWidth
                    onClick={async () => {
                      const newlyAddedHousehold = await addHousehold();
                      setSelectedHouseholdId(newlyAddedHousehold.id);
                      onSelectHousehold();
                      setEditingHouseholdTitle(true);
                    }}
                    variant="contained"
                  >
                    Add household
                  </Button>
                )}
                {dialogStep == 'place' && place.households.length == 1 && (
                  <ButtonGroup variant="contained">
                    <Button
                      fullWidth
                      onClick={() => {
                        setSelectedHouseholdId(place.households[0].id);
                        onWizard();
                      }}
                    >
                      Log visit
                    </Button>
                    <Button
                      onClick={(ev) => setAnchorEl(ev.currentTarget)}
                      size="small"
                    >
                      <MoreVert />
                    </Button>
                  </ButtonGroup>
                )}
                {dialogStep == 'place' && place.households.length > 1 && (
                  <ButtonGroup variant="contained">
                    <Button
                      fullWidth
                      onClick={() => {
                        onPickHousehold();
                      }}
                    >
                      Log visit
                    </Button>
                    <Button
                      onClick={(ev) => setAnchorEl(ev.currentTarget)}
                      size="small"
                    >
                      <MoreVert />
                    </Button>
                  </ButtonGroup>
                )}

                {dialogStep == 'edit' && (
                  <Button
                    disabled={saveButtonDisabled}
                    onClick={() => {
                      if (dialogStep == 'edit') {
                        updatePlace({
                          description,
                          title,
                        });
                      }
                    }}
                    variant="contained"
                  >
                    Save
                  </Button>
                )}
                <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    horizontal: 'left',
                    vertical: 'top',
                  }}
                  onClose={() => setAnchorEl(null)}
                  open={!!anchorEl}
                  transformOrigin={{
                    horizontal: 'center',
                    vertical: 'bottom',
                  }}
                >
                  <MenuItem
                    onClick={async () => {
                      const newlyAddedHousehold = await addHousehold();
                      setSelectedHouseholdId(newlyAddedHousehold.id);
                      onSelectHousehold();
                      setEditingHouseholdTitle(true);
                      setAnchorEl(null);
                    }}
                  >
                    Add household
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          );
        }}
      </ZUIFuture>
    </Box>
  );
};

export default PlaceDialog;
