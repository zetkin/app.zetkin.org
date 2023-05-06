import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MapIcon from '@mui/icons-material/Map';
import { Add, Close } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Dialog,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';

import EventTypeAutocomplete from 'features/events/components/EventTypeAutocomplete';
import EventTypesModel from 'features/events/models/EventTypesModel';
import LocationModal from 'features/events/components/LocationModal';
import LocationsModel from 'features/events/models/LocationsModel';
import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import useNumericRouteParams from 'core/hooks/useNumericRouteParams';
import { ZetkinLocation } from 'utils/types/zetkin';
import ZUIFutures from 'zui/ZUIFutures';
import { dateIsBefore, isValidDate } from 'utils/dateUtils';

interface EventShiftModalProps {
  dates: [Date, Date];
  open: boolean;
  close: () => void;
}

const EventShiftModal: FC<EventShiftModalProps> = ({ close, dates, open }) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();

  const [invalidFormat, setInvalidFormat] = useState(false);
  const [endDate, setEndDate] = useState<Date>(dates[1]);
  const [editingTypeOrTitle, setEditingTypeOrTitle] = useState(false);
  const typesModel = useModel((env) => new EventTypesModel(env, orgId));
  const locationsModel = useModel((env) => new LocationsModel(env, orgId));
  const locations = locationsModel.getLocations().data;
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const options: (
    | ZetkinLocation
    | 'CREATE_NEW_LOCATION'
    | 'NO_PHYSICAL_LOCATION'
  )[] = locations
    ? [...locations, 'NO_PHYSICAL_LOCATION', 'CREATE_NEW_LOCATION']
    : ['NO_PHYSICAL_LOCATION', 'CREATE_NEW_LOCATION'];

  const [typeId, setTypeId] = useState<number>(0);
  const [typeTitle, setTypeTitle] = useState<string>('');
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventDate, setEventDate] = useState<Date>(dates[0]);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [eventLink, setEventLink] = useState<string>('');
  const [eventDescription, setEventDescription] = useState<string>('');
  const [eventParticipants, setEventParticipants] = useState<number | null>(
    null
  );

  return (
    <Dialog fullWidth maxWidth="lg" onClose={close} open={open}>
      <Box display="flex" justifyContent="space-between" padding={2}>
        <Typography variant="h4">
          {messages.eventShiftModal.header()}
        </Typography>
        <Close
          color="secondary"
          onClick={() => {
            close();
          }}
          sx={{
            cursor: 'pointer',
          }}
        />
      </Box>
      <Box display="flex">
        <Box padding={1}>
          <Box></Box>
          <ZUIFutures
            futures={{
              types: typesModel.getTypes(),
            }}
          >
            {({ data: { types } }) => {
              return (
                <EventTypeAutocomplete
                  onBlur={() => setEditingTypeOrTitle(false)}
                  onChange={(newValue) => {
                    if (newValue) {
                      setTypeId(newValue.id);
                      setTypeTitle(newValue.title);
                    }
                    setEditingTypeOrTitle(false);
                  }}
                  onChangeNewOption={(newValueId) => setTypeId(newValueId)}
                  onFocus={() => setEditingTypeOrTitle(true)}
                  showBorder={editingTypeOrTitle}
                  types={types}
                  typesModel={typesModel}
                  value={{ id: typeId, title: typeTitle }}
                />
              );
            }}
          </ZUIFutures>

          <TextField
            fullWidth
            label={messages.eventShiftModal.customTitle()}
            maxRows={1}
            onChange={(ev) => setEventTitle(ev.target.value)}
            sx={{ margin: 1 }}
            value={eventTitle}
          />
          <Box margin={1}>
            <DatePicker
              inputFormat="DD-MM-YYYY"
              label={messages.eventShiftModal.date()}
              onChange={(newValue) => {
                if (newValue && isValidDate(newValue)) {
                  setInvalidFormat(false);
                  setEventDate(newValue);
                  if (dateIsBefore(newValue, endDate)) {
                    setEndDate(newValue);
                  }
                } else {
                  setInvalidFormat(true);
                }
              }}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    error={invalidFormat}
                    inputProps={{
                      ...params.inputProps,
                    }}
                    sx={{ marginBottom: '15px' }}
                  />
                );
              }}
              value={eventDate}
            />
          </Box>

          <Box alignItems="center" display="flex" margin={1}>
            <Autocomplete
              disableClearable
              fullWidth
              getOptionLabel={(option) =>
                option === 'CREATE_NEW_LOCATION'
                  ? messages.eventOverviewCard.createLocation()
                  : option === 'NO_PHYSICAL_LOCATION'
                  ? messages.eventOverviewCard.noLocation()
                  : option.title
              }
              onChange={(ev, option) => {
                if (option === 'CREATE_NEW_LOCATION') {
                  setLocationModalOpen(true);
                  return;
                }
                if (option === 'NO_PHYSICAL_LOCATION') {
                  setLocationId(null);
                  return;
                }
                const location = locations?.find(
                  (location) => location.id === option.id
                );
                if (!location) {
                  return;
                }
                setLocationId(location.id);
              }}
              options={options}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={messages.eventOverviewCard.location()}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '5px',
                  }}
                />
              )}
              renderOption={(params, option) =>
                option === 'CREATE_NEW_LOCATION' ? (
                  <li {...params}>
                    <Add sx={{ marginRight: 2 }} />
                    {messages.eventOverviewCard.createLocation()}
                  </li>
                ) : option === 'NO_PHYSICAL_LOCATION' ? (
                  <li {...params}>{messages.eventOverviewCard.noLocation()}</li>
                ) : (
                  <li {...params}>{option.title}</li>
                )
              }
              value={
                locationId === null
                  ? 'NO_PHYSICAL_LOCATION'
                  : options?.find(
                      (location) =>
                        location !== 'CREATE_NEW_LOCATION' &&
                        location !== 'NO_PHYSICAL_LOCATION' &&
                        location.id === locationId
                    )
              }
            />
            <MapIcon
              color="secondary"
              onClick={() => setLocationModalOpen(true)}
              sx={{ cursor: 'pointer', marginLeft: 1 }}
            />
            <LocationModal
              locationId={locationId}
              locations={locations || []}
              model={locationsModel}
              onCreateLocation={(newLocation: Partial<ZetkinLocation>) => {
                locationsModel.addLocation(newLocation);
              }}
              onMapClose={() => {
                setLocationModalOpen(false);
              }}
              onSelectLocation={(location: ZetkinLocation) =>
                setLocationId(location.id)
              }
              open={locationModalOpen}
            />
          </Box>

          <TextField
            fullWidth
            label={messages.eventShiftModal.link()}
            maxRows={1}
            onChange={(ev) => setEventLink(ev.target.value)}
            sx={{ margin: 1 }}
            value={eventLink}
          />

          <TextField
            fullWidth
            label={messages.eventShiftModal.description()}
            maxRows={4}
            multiline
            onChange={(ev) => setEventDescription(ev.target.value)}
            sx={{ margin: 1 }}
            value={eventDescription}
          />

          <Typography margin={1} variant="subtitle2">
            {messages.eventShiftModal.participation().toUpperCase()}
          </Typography>

          <TextField
            fullWidth
            label={messages.eventShiftModal.participationDescription()}
            onChange={(ev) => {
              const val = ev.target.value;

              if (val == '') {
                setEventParticipants(null);
                return;
              }

              const intVal = parseInt(val);
              if (!isNaN(intVal) && intVal.toString() == val) {
                setEventParticipants(intVal);
              }
            }}
            sx={{ margin: 1 }}
            value={eventParticipants === null ? '' : eventParticipants}
          />
        </Box>
        <Box></Box>
      </Box>
    </Dialog>
  );
};

export default EventShiftModal;
