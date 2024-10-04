import {
  ArrowBackIos,
  Check,
  Edit,
  ThumbDown,
  ThumbUp,
} from '@mui/icons-material';
import { FC, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Dialog,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';

import theme from 'theme';
import { isWithinLast24Hours } from '../utils/isWithinLast24Hours';
import messageIds from '../l10n/messageIds';
import usePlaceMutations from '../hooks/usePlaceMutations';
import { ZetkinPlace } from '../types';
import ZUIDateTime from 'zui/ZUIDateTime';
import { Msg, useMessages } from 'core/i18n';

type PlaceDialogProps = {
  canvassAssId: string | null;
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
  canvassAssId,
  dialogStep,
  onClose,
  onEdit,
  onUpdateDone,
  onSelectHousehold,
  open,
  orgId,
  place,
}) => {
  const {
    addHousehold,
    addVisit,
    updateHousehold,
    updatePlace,
    isAddVisitLoading,
  } = usePlaceMutations(orgId, place.id);
  const messages = useMessages(messageIds);

  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(
    null
  );
  const [description, setDescription] = useState<string>(
    place.description ?? ''
  );
  const [title, setTitle] = useState<string>(place.title ?? '');
  const [type, setType] = useState<'address' | 'misc'>(place.type);
  const [editingHouseholdTitle, setEditingHouseholdTitle] = useState(false);
  const [householdTitle, setHousholdTitle] = useState('');

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

  const nothingHasBeenEdited =
    dialogStep == 'edit' &&
    title == place.title &&
    type == place.type &&
    (description == place.description || (!description && !place.description));

  const saveButtonDisabled = nothingHasBeenEdited;

  const getBackButtonMessage = () => {
    if (dialogStep == 'edit') {
      if (nothingHasBeenEdited) {
        return messageIds.place.backButton;
      } else {
        return messageIds.place.cancelButton;
      }
    } else if (dialogStep == 'household') {
      return messageIds.place.closeButton;
    } else {
      return messageIds.place.closeButton;
    }
  };

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
          {dialogStep !== 'edit' && (
            <>
              {dialogStep !== 'household' && (
                <Typography alignItems="center" display="flex" variant="h6">
                  {place?.title || <Msg id={messageIds.place.empty.title} />}
                </Typography>
              )}
              {selectedHousehold && dialogStep == 'household' && (
                <Typography alignItems="center" display="flex" variant="h6">
                  <ArrowBackIos
                    onClick={() => {
                      onUpdateDone();
                    }}
                    sx={{ marginRight: 2 }}
                  />
                  {selectedHousehold.title || (
                    <Msg id={messageIds.place.household.empty.title} />
                  )}
                </Typography>
              )}

              {selectedHousehold && dialogStep == 'household' && (
                <Button
                  onClick={() => {
                    setHousholdTitle(selectedHousehold.title);
                    setEditingHouseholdTitle(true);
                  }}
                  variant="outlined"
                >
                  <Edit />
                </Button>
              )}
              {dialogStep === 'place' && (
                <Button onClick={onEdit} variant="outlined">
                  <Edit />
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
              <Divider />
              <Typography color="secondary">
                {place.description || (
                  <Msg id={messageIds.place.empty.description} />
                )}
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                flexGrow={2}
                gap={1}
                overflow="hidden"
              >
                <Typography variant="h6">
                  <Msg
                    id={messageIds.place.householdsHeader}
                    values={{ numberOfHouseholds: place.households.length }}
                  />
                </Typography>
                <Divider />
                <Box
                  display="flex"
                  flexDirection="column"
                  sx={{ overflowY: 'auto' }}
                >
                  {place.households.map((household) => {
                    const visitedRecently = isWithinLast24Hours(
                      household.visits.map((t) => t.timestamp)
                    );
                    return (
                      <Box
                        key={household.id}
                        alignItems="center"
                        display="flex"
                        justifyContent="space-between"
                        mb={1}
                        mt={1}
                        onClick={() => {
                          setSelectedHouseholdId(household.id);
                          onSelectHousehold();
                        }}
                        width="100%"
                      >
                        {household.title || (
                          <Msg id={messageIds.place.household.empty.title} />
                        )}

                        {visitedRecently ? <Check /> : ''}
                      </Box>
                    );
                  })}
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
              <Box>
                {editingHouseholdTitle && (
                  <Box alignItems="center" display="flex">
                    <TextField
                      onChange={(ev) => setHousholdTitle(ev.target.value)}
                      placeholder="Household title"
                      value={householdTitle}
                    />
                    <Button
                      onClick={() => {
                        updateHousehold(selectedHousehold.id, {
                          title: householdTitle,
                        });
                        setEditingHouseholdTitle(false);
                        setHousholdTitle('');
                      }}
                    >
                      Save
                    </Button>
                    <Button onClick={() => setEditingHouseholdTitle(false)}>
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                flexGrow={1}
                overflow="hidden"
              >
                <Box
                  alignSelf="center"
                  display="flex"
                  flexDirection="column"
                  padding={6}
                  width="100%"
                >
                  <Button
                    disabled={isWithinLast24Hours(
                      selectedHousehold.visits.map((t) => t.timestamp)
                    )}
                    endIcon={
                      isWithinLast24Hours(
                        selectedHousehold.visits.map((t) => t.timestamp)
                      ) ? (
                        <Check />
                      ) : (
                        ''
                      )
                    }
                    onClick={() => {
                      addVisit(selectedHousehold.id, {
                        canvassAssId,
                        timestamp: new Date().toISOString(),
                      });
                    }}
                    startIcon={
                      isAddVisitLoading ? (
                        <CircularProgress
                          size={20}
                          sx={{ color: theme.palette.common.white }}
                        />
                      ) : (
                        ''
                      )
                    }
                    sx={{ marginBottom: 2 }}
                    variant="contained"
                  >
                    <Msg
                      id={
                        isWithinLast24Hours(
                          selectedHousehold.visits.map((t) => t.timestamp)
                        )
                          ? messageIds.place.visitedButton
                          : messageIds.place.visitButton
                      }
                    />
                  </Button>
                  <ButtonGroup
                    disabled={isWithinLast24Hours(
                      selectedHousehold.visits.map((t) => t.timestamp)
                    )}
                    fullWidth
                    sx={{ alignSelf: 'center', display: 'flex' }}
                    variant="outlined"
                  >
                    {!isAddVisitLoading && (
                      <>
                        <Button
                          onClick={() =>
                            addVisit(selectedHousehold.id, {
                              canvassAssId,
                              rating: 'good',
                              timestamp: new Date().toISOString(),
                            })
                          }
                        >
                          <ThumbUp />
                        </Button>
                        <Button
                          onClick={() =>
                            addVisit(selectedHousehold.id, {
                              canvassAssId,
                              rating: 'bad',
                              timestamp: new Date().toISOString(),
                            })
                          }
                        >
                          <ThumbDown />
                        </Button>
                      </>
                    )}
                    {isAddVisitLoading && (
                      <Button variant="outlined">
                        <CircularProgress size={25} />
                      </Button>
                    )}
                  </ButtonGroup>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  sx={{ marginTop: 2, overflowY: 'auto' }}
                >
                  <Typography
                    marginBottom={2}
                    sx={{ alignItems: 'baseline', display: 'flex' }}
                    variant="h6"
                  >
                    <Msg id={messageIds.place.logList} />
                    <Typography sx={{ marginLeft: 1 }}>
                      {sortedVisits.length}
                    </Typography>
                  </Typography>
                  <Divider />
                  {sortedVisits.length == 0 && (
                    <Msg id={messageIds.place.noActivity} />
                  )}
                  {sortedVisits.map((visit) => (
                    <Box key={visit.id} paddingTop={1}>
                      <Typography>{messages.place.visitLog()}</Typography>
                      <Typography
                        color="secondary"
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <ZUIDateTime datetime={visit.timestamp} />
                        {visit.rating && (
                          <Box>
                            {visit.rating === 'good' ? (
                              <ThumbUp sx={{ fontSize: 20 }} />
                            ) : (
                              <ThumbDown sx={{ fontSize: 20 }} />
                            )}
                          </Box>
                        )}
                        <Check />
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
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
          <Button
            onClick={() => {
              if (dialogStep === 'place') {
                onClose();
              } else if (dialogStep === 'edit') {
                onUpdateDone();
                setTitle(place.title ?? '');
                setDescription(place.description ?? '');
                setType(place.type);
              } else if (dialogStep == 'household') {
                onUpdateDone();
                onClose();
              }
            }}
            variant="outlined"
          >
            <Msg id={getBackButtonMessage()} />
          </Button>
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
