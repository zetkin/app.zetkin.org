import { DatePicker } from '@mui/x-date-pickers-pro';
import { Add, Map } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { FC, useState } from 'react';

import EventModalTypeAutocomplete from './EventModalTypeAutocomplete';
import LocationModal from 'features/events/components/LocationModal';
import messageIds from 'features/events/l10n/messageIds';
import useCreateType from 'features/events/hooks/useCreateType';
import useEventLocationMutations from 'features/events/hooks/useEventLocationMutations';
import useEventLocations from 'features/events/hooks/useEventLocations';
import useEventTypes from 'features/events/hooks/useEventTypes';
import useParallelEvents from 'features/events/hooks/useParallelEvents';
import { ZetkinLocation } from 'utils/types/zetkin';
import ZUIFuture from 'zui/ZUIFuture';
import { Msg, useMessages } from 'core/i18n';

interface EventShiftDetailsProps {
  eventDate: Dayjs;
  eventDescription: string;
  eventEndTime: Dayjs;
  eventLink: string;
  eventParticipants: number | null;
  eventStartTime: Dayjs;
  eventTitle: string;
  locationId: number | null;
  onEventDateChange: (newDate: Dayjs | null) => void;
  onEventDescriptionChange: (newDescription: string) => void;
  onEventLinkChange: (newLink: string) => void;
  onEventParticipantsChange: (newValue: number | null) => void;
  onEventTitleChange: (newTitle: string) => void;
  onLocationIdChange: (newId: number | null) => void;
  onNewType: (newType: { id: number; title: string }) => void;
  onTypeChange: (newType: { id: number; title: string } | null) => void;
  orgId: number;
  typeId: number;
  typeTitle: string;
}

const EventShiftDetails: FC<EventShiftDetailsProps> = ({
  eventDate,
  eventDescription,
  eventEndTime,
  eventLink,
  eventParticipants,
  eventTitle,
  eventStartTime,
  locationId,
  onEventDateChange,
  onEventDescriptionChange,
  onEventLinkChange,
  onEventParticipantsChange,
  onEventTitleChange,
  onLocationIdChange,
  onNewType,
  onTypeChange,
  typeId,
  typeTitle,
  orgId,
}) => {
  const messages = useMessages(messageIds);

  const eventTypesFuture = useEventTypes(orgId);
  const createType = useCreateType(orgId);

  const parallellEvents = useParallelEvents(
    orgId,
    eventStartTime.toISOString(),
    eventEndTime.toISOString()
  );
  const { addLocation } = useEventLocationMutations(orgId);
  const locations = useEventLocations(orgId);
  const options: (
    | ZetkinLocation
    | 'CREATE_NEW_LOCATION'
    | 'NO_PHYSICAL_LOCATION'
  )[] = locations
    ? [...locations, 'NO_PHYSICAL_LOCATION', 'CREATE_NEW_LOCATION']
    : ['NO_PHYSICAL_LOCATION', 'CREATE_NEW_LOCATION'];

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [showExtraSettings, setShowExtraSettings] = useState(false);

  return (
    <Box display="flex" flexDirection="column" gap={2} padding={2}>
      <ZUIFuture future={eventTypesFuture}>
        {(eventTypes) => {
          return (
            <EventModalTypeAutocomplete
              label={messages.eventShiftModal.type()}
              onChange={(newType) => onTypeChange(newType)}
              onChangeNewOption={(newType) => onNewType(newType)}
              onCreateType={createType}
              types={eventTypes}
              value={{ id: typeId, title: typeTitle }}
            />
          );
        }}
      </ZUIFuture>
      <TextField
        fullWidth
        label={messages.eventShiftModal.customTitle()}
        maxRows={1}
        onChange={(ev) => onEventTitleChange(ev.target.value)}
        value={eventTitle}
      />
      <DatePicker
        format="DD-MM-YYYY"
        label={messages.eventOverviewCard.startDate()}
        onChange={(newValue) => onEventDateChange(newValue)}
        value={dayjs(eventDate)}
      />
      <Box alignItems="center" display="flex">
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
              onLocationIdChange(null);
              return;
            }
            const location = locations?.find(
              (location) => location.id === option.id
            );
            if (!location) {
              return;
            }
            onLocationIdChange(location.id);
          }}
          options={options}
          renderInput={(params) => (
            <TextField
              {...params}
              label={messages.eventOverviewCard.location()}
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
        <Map
          color="secondary"
          onClick={() => setLocationModalOpen(true)}
          sx={{ cursor: 'pointer', marginLeft: 1 }}
        />
        <LocationModal
          events={parallellEvents || []}
          locationId={locationId}
          locations={locations || []}
          onCreateLocation={(newLocation: Partial<ZetkinLocation>) => {
            addLocation(newLocation);
          }}
          onMapClose={() => {
            setLocationModalOpen(false);
          }}
          onSelectLocation={(location: ZetkinLocation) =>
            onLocationIdChange(location.id)
          }
          open={locationModalOpen}
          orgId={orgId}
        />
      </Box>
      {!showExtraSettings && (
        <Button
          onClick={() => setShowExtraSettings(true)}
          sx={{ alignSelf: 'flex-start' }}
        >
          <Msg id={messageIds.eventShiftModal.showExtraSettingsButton} />
        </Button>
      )}
      {showExtraSettings && (
        <>
          <TextField
            fullWidth
            label={messages.eventShiftModal.link()}
            maxRows={1}
            onChange={(ev) => onEventLinkChange(ev.target.value)}
            value={eventLink}
          />
          <TextField
            fullWidth
            label={messages.eventShiftModal.description()}
            maxRows={4}
            multiline
            onChange={(ev) => onEventDescriptionChange(ev.target.value)}
            value={eventDescription}
          />
          <Typography
            color="secondary"
            textTransform="uppercase"
            variant="body2"
          >
            <Msg id={messageIds.eventShiftModal.participation} />
          </Typography>
          <TextField
            fullWidth
            label={messages.eventShiftModal.participationDescription()}
            onChange={(ev) => {
              const val = ev.target.value;

              if (val == '') {
                onEventParticipantsChange(null);
                return;
              }

              const intVal = parseInt(val);
              if (!isNaN(intVal) && intVal.toString() == val) {
                onEventParticipantsChange(intVal);
              }
            }}
            value={eventParticipants === null ? '' : eventParticipants}
          />
        </>
      )}
    </Box>
  );
};

export default EventShiftDetails;
