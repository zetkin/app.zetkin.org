import { Forward } from '@mui/icons-material';
import { FC, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';

import { ZetkinPlace } from '../types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import usePlaceMutations from '../hooks/usePlaceMutations';
import ZUIDateTime from 'zui/ZUIDateTime';

type PlaceDialogProps = {
  dialogStep: 'place' | 'edit' | 'household';
  onClose: () => void;
  onEdit: () => void;
  onSelectHousehold: () => void;
  onUpdateDone: () => void;
  open: boolean;
  orgId: number;
  place: ZetkinPlace;
};

const PlaceDialog: FC<PlaceDialogProps> = ({
  dialogStep,
  onClose,
  onEdit,
  onUpdateDone,
  onSelectHousehold,
  open,
  orgId,
  place,
}) => {
  const updatePlace = usePlaceMutations(orgId, place.id);
  const messages = useMessages(messageIds);
  const timestamp = new Date().toISOString();

  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(
    null
  );
  const [note, setNote] = useState('');
  const [description, setDescription] = useState<string>(
    place.description ?? ''
  );
  const [title, setTitle] = useState<string>(place.title ?? '');
  const [type, setType] = useState<'address' | 'misc'>(place.type);

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as 'address' | 'misc');
  };

  const selectedHousehold = place.households.find(
    (household) => household.id == selectedHouseholdId
  );

  const sortedVisits =
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
    }) || [];

  return (
    <Dialog fullWidth maxWidth="xl" onClose={onClose} open={open}>
      <Box display="flex" flexDirection="column" height="90vh" padding={2}>
        <Box
          paddingBottom={1}
          sx={{
            alignItems: 'baseline',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {dialogStep !== 'edit' && (
            <>
              <Typography variant="h6">
                {place?.title || <Msg id={messageIds.place.empty.title} />}
              </Typography>
              {dialogStep === 'place' && (
                <Button onClick={onEdit} variant="outlined">
                  <Msg id={messageIds.place.editButton} />
                </Button>
              )}
            </>
          )}
          {dialogStep === 'edit' && (
            <Typography variant="h6">
              <Msg
                id={messageIds.place.editPlace}
                values={{
                  placeName: place.title || messages.place.empty.title(),
                }}
              />
            </Typography>
          )}
        </Box>
        <Divider />
        <Box flexGrow={1} overflow="hidden">
          {dialogStep === 'edit' && (
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              height="100%"
              paddingTop={2}
            >
              <TextField
                defaultValue={title}
                fullWidth
                label={messages.place.editTitle()}
                onChange={(ev) => setTitle(ev.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel id="type-of-place-label">
                  <Msg id={messageIds.place.selectType} />
                </InputLabel>
                <Select
                  fullWidth
                  label={messages.placeCard.inputLabel()}
                  labelId="type-of-place-label"
                  onChange={handleChange}
                  value={type}
                >
                  <MenuItem value="address">
                    <Msg id={messageIds.placeCard.address} />
                  </MenuItem>
                  <MenuItem value="misc">
                    <Msg id={messageIds.placeCard.misc} />
                  </MenuItem>
                </Select>
              </FormControl>
              <TextField
                defaultValue={description}
                fullWidth
                label={messages.place.editDescription()}
                multiline
                onChange={(ev) => setDescription(ev.target.value)}
                rows={5}
              />
            </Box>
          )}
          {place && dialogStep == 'place' && (
            <Box
              display="flex"
              flexDirection="column"
              gap={1}
              height="100%"
              justifyContent="space-between"
              paddingTop={1}
            >
              <Typography variant="h6">
                <Msg id={messageIds.place.description} />
              </Typography>
              <Typography>
                {place.description || (
                  <Msg id={messageIds.place.empty.description} />
                )}
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                flexGrow={1}
                overflow="hidden"
              >
                <Typography variant="h6">
                  <Msg id={messageIds.place.householdsHeader} />
                </Typography>
                <Box
                  display="flex"
                  flexDirection="column"
                  sx={{ overflowY: 'auto' }}
                >
                  {place.households.length == 0 && 'No households'}
                  {place.households.map((household, index) => (
                    <Box
                      key={household.id}
                      alignItems="center"
                      display="flex"
                      justifyContent="space-between"
                      width="100%"
                    >
                      {household.id || `Household nr ${index + 1}`}
                      <IconButton
                        onClick={() => {
                          setSelectedHouseholdId(household.id);
                          onSelectHousehold();
                        }}
                      >
                        <Forward />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
          {selectedHousehold && dialogStep == 'household' && (
            <Box
              display="flex"
              flexDirection="column"
              gap={1}
              height="100%"
              paddingTop={1}
            >
              <Box>{selectedHousehold.id}</Box>
              <Box
                display="flex"
                flexDirection="column"
                flexGrow={1}
                overflow="hidden"
              >
                <Box paddingTop={1}>
                  <ZUIDateTime datetime={timestamp} />
                  <TextField
                    fullWidth
                    multiline
                    onChange={(ev) => setNote(ev.target.value)}
                    placeholder={messages.place.notePlaceholder()}
                    sx={{ paddingTop: 1 }}
                    value={note}
                  />
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  sx={{ overflowY: 'auto' }}
                >
                  {sortedVisits.length == 0 && (
                    <Msg id={messageIds.place.noActivity} />
                  )}
                  {sortedVisits.map((visit) => (
                    <Box key={visit.timestamp} paddingTop={1}>
                      <Typography color="secondary">
                        <ZUIDateTime datetime={visit.timestamp} />
                      </Typography>
                      <Typography>{visit.note}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
        <Box display="flex" gap={1} justifyContent="flex-end" paddingTop={1}>
          <Button
            onClick={() => {
              if (dialogStep === 'place') {
                onClose();
              } else if (dialogStep === 'edit') {
                onUpdateDone();
              } else if (dialogStep == 'household') {
                onUpdateDone();
                setNote('');
              }
            }}
            variant="outlined"
          >
            <Msg
              id={
                dialogStep == 'place'
                  ? messageIds.place.closeButton
                  : messageIds.place.cancelButton
              }
            />
          </Button>
          {dialogStep != 'place' && (
            <Button
              disabled={dialogStep == 'household' && !note}
              onClick={() => {
                setNote('');
                if (selectedHousehold && dialogStep == 'household') {
                  const newVisit = {
                    note,
                    timestamp: new Date().toISOString(),
                  };

                  const updatedHousehold = {
                    ...selectedHousehold,
                    visits: [...selectedHousehold.visits, newVisit],
                  };

                  updatePlace({
                    ...place,
                    households: place.households.map((household) =>
                      household.id == selectedHousehold.id
                        ? updatedHousehold
                        : household
                    ),
                  });
                } else if (dialogStep == 'edit') {
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
