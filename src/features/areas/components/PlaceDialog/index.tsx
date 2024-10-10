import { ArrowBackIos, Close, Edit } from '@mui/icons-material';
import { FC, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';

import messageIds from '../../l10n/messageIds';
import usePlaceMutations from '../../hooks/usePlaceMutations';
import { HouseholdPatchBody, ZetkinPlace } from '../../types';
import { Msg, useMessages } from 'core/i18n';
import VisitWizard, { WizardStep } from './VisitWizard';
import EditPlace from './EditPlace';
import Place from './Place';
import Household from './Household';
import { isWithinLast24Hours } from 'features/areas/utils/isWithinLast24Hours';

export type PlaceType = 'address' | 'misc';

type PlaceDialogProps = {
  canvassAssId: string | null;
  dialogStep: 'place' | 'edit' | 'household' | 'wizard';
  onClose: () => void;
  onEdit: () => void;
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
  onUpdateDone,
  onSelectHousehold,
  onWizard,
  open,
  orgId,
  place,
}) => {
  const { addVisit, addHousehold, updateHousehold, updatePlace } =
    usePlaceMutations(orgId, place.id);

  const messages = useMessages(messageIds);

  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(
    null
  );
  const [description, setDescription] = useState<string>(
    place.description ?? ''
  );
  const [title, setTitle] = useState<string>(place.title ?? '');
  const [type, setType] = useState<PlaceType>(place.type);
  const [editingHouseholdTitle, setEditingHouseholdTitle] = useState(false);
  const [householdTitle, setHousholdTitle] = useState('');

  const [wizardStep, setWizardStep] = useState<WizardStep | null>(null);

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
    type == place.type &&
    (description == place.description || (!description && !place.description));

  const saveButtonDisabled = nothingHasBeenEdited;

  const showWizard =
    selectedHousehold && dialogStep == 'wizard' && !!wizardStep;

  return (
    <Dialog fullWidth maxWidth="xl" onClose={onClose} open={open}>
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
                {place?.title || <Msg id={messageIds.place.empty.title} />}
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
          {dialogStep == 'edit' && (
            <>
              <Typography variant="h6">
                <Msg
                  id={messageIds.place.editPlace}
                  values={{
                    placeName: place.title || messages.place.empty.title(),
                  }}
                />
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
                  {selectedHousehold.title || (
                    <Msg id={messageIds.place.household.empty.title} />
                  )}
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
                  setWizardStep(null);
                  onSelectHousehold();
                }}
              >
                <ArrowBackIos />
              </IconButton>
              <Typography alignItems="center" display="flex" variant="h6">
                {selectedHousehold.title || (
                  <Msg id={messageIds.place.household.empty.title} />
                )}
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
          {dialogStep === 'edit' && (
            <EditPlace
              description={description}
              onDescriptionChange={(newDescription) =>
                setDescription(newDescription)
              }
              onTitleChange={(newTitle) => setTitle(newTitle)}
              onTypeChange={(newType) => setType(newType)}
              title={title}
              type={type}
            />
          )}
          {selectedHousehold && dialogStep == 'household' && (
            <Household
              editingHouseholdTitle={editingHouseholdTitle}
              householdTitle={householdTitle}
              onEditHouseholdTitleEnd={() => setEditingHouseholdTitle(false)}
              onHouseholdTitleChange={(newTitle) => setHousholdTitle(newTitle)}
              onHouseholdUpdate={(data: HouseholdPatchBody) =>
                updateHousehold(selectedHousehold.id, data)
              }
              onWizardStart={() => {
                onWizard();
                setWizardStep(1);
              }}
              visitedRecently={isWithinLast24Hours(
                selectedHousehold.visits.map((t) => t.timestamp)
              )}
            />
          )}
          {showWizard && (
            <VisitWizard
              onExit={onSelectHousehold}
              onRecordVisit={(report) =>
                addVisit(selectedHousehold.id, {
                  ...report,
                  canvassAssId,
                  timestamp: new Date().toISOString(),
                })
              }
              onStepChange={setWizardStep}
              step={wizardStep}
            />
          )}
        </Box>
        <Box display="flex" gap={1} justifyContent="flex-end" paddingTop={1}>
          {dialogStep === 'place' && (
            <Button
              onClick={async () => {
                const newlyAddedHousehold = await addHousehold();
                setSelectedHouseholdId(newlyAddedHousehold.id);
                onSelectHousehold();
                setEditingHouseholdTitle(true);
              }}
              variant="contained"
            >
              <Msg id={messageIds.place.addHouseholdButton} />
            </Button>
          )}
          {dialogStep == 'edit' && (
            <Button
              disabled={saveButtonDisabled}
              onClick={() => {
                if (dialogStep == 'edit') {
                  updatePlace({
                    description,
                    title,
                    type,
                  });
                }
              }}
              variant="contained"
            >
              <Msg id={messageIds.place.saveButton} />
            </Button>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

export default PlaceDialog;
