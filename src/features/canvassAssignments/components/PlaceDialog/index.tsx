import {
  ArrowBackIos,
  Check,
  Close,
  Edit,
  MoreVert,
} from '@mui/icons-material';
import { FC, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
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
import { isWithinLast24Hours } from 'features/canvassAssignments/utils/isWithinLast24Hours';
import ZUIFuture from 'zui/ZUIFuture';
import { PlaceDialogStep } from '../PublicAreaMap';
import { ZetkinPlace } from 'features/canvassAssignments/types';
import usePlaceMutations from 'features/canvassAssignments/hooks/usePlaceMutations';
import useCanvassAssignment from 'features/canvassAssignments/hooks/useCanvassAssignment';

type PlaceDialogProps = {
  canvassAssId: string;
  dialogStep: PlaceDialogStep;
  onClose: () => void;
  onEdit: () => void;
  onPickHousehold: () => void;
  onSelectHousehold: () => void;
  onUpdateDone: () => void;
  onWizard: () => void;
  open: boolean;
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
  open,
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
    <Dialog fullWidth maxWidth="xl" onClose={onClose} open={open}>
      <ZUIFuture future={assignmentFuture}>
        {(assignment) => (
          <Box display="flex" flexDirection="column" height="90vh" padding={2}>
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
                <Box display="flex" justifyContent="space-between" width="100%">
                  <Box alignItems="center" display="flex">
                    <IconButton
                      onClick={() => {
                        onUpdateDone();
                      }}
                    >
                      <ArrowBackIos />
                    </IconButton>
                    <Typography variant="h6">Log visit</Typography>
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
                <Box display="flex" justifyContent="space-between" width="100%">
                  <Box alignItems="center" display="flex">
                    <IconButton
                      onClick={() => {
                        onUpdateDone();
                      }}
                    >
                      <ArrowBackIos />
                    </IconButton>
                    <Typography alignItems="center" display="flex" variant="h6">
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
                <Box>
                  <Typography variant="h6">Choose household</Typography>
                  {place.households.map((household) => {
                    const visitedRecently = isWithinLast24Hours(
                      household.visits.map((t) => t.timestamp)
                    );
                    return (
                      <Box
                        key={household.id}
                        alignItems="center"
                        display="flex"
                        mb={1}
                        mt={1}
                        onClick={() => {
                          if (!visitedRecently) {
                            setSelectedHouseholdId(household.id);
                            onWizard();
                          }
                        }}
                        width="100%"
                      >
                        <Box flexGrow={1}>
                          <Typography
                            color={visitedRecently ? 'secondary' : ''}
                          >
                            {household.title || 'Untitled household'}
                          </Typography>
                        </Box>
                        {visitedRecently ? <Check color="secondary" /> : ''}
                      </Box>
                    );
                  })}
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
                  visitedRecently={isWithinLast24Hours(
                    selectedHousehold.visits.map((t) => t.timestamp)
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
            <Box display="flex" gap={1} justifyContent="center" paddingTop={1}>
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
        )}
      </ZUIFuture>
    </Dialog>
  );
};

export default PlaceDialog;
