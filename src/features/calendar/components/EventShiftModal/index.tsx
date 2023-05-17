import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MapIcon from '@mui/icons-material/Map';
import { TimePicker } from '@mui/x-date-pickers';
import { useStore } from 'react-redux';
import { Add, Close } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { FC, useEffect, useState } from 'react';

import { eventCreated } from 'features/events/store';
import { EventsModel } from 'features/events/models/EventsModel';
import EventTypeAutocomplete from 'features/events/components/EventTypeAutocomplete';
import EventTypesModel from 'features/events/models/EventTypesModel';
import LocationModal from 'features/events/components/LocationModal';
import LocationsModel from 'features/events/models/LocationsModel';
import messageIds from 'features/events/l10n/messageIds';
import { useEnv } from 'core/hooks';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import useNumericRouteParams from 'core/hooks/useNumericRouteParams';
import { ZetkinEventPostBody } from 'features/events/repo/EventsRepo';
import ZUIFutures from 'zui/ZUIFutures';
import { ZetkinEvent, ZetkinLocation } from 'utils/types/zetkin';

interface EventShiftModalProps {
  dates: [Date, Date];
  open: boolean;
  close: () => void;
}

const EventShiftModal: FC<EventShiftModalProps> = ({ close, dates, open }) => {
  const messages = useMessages(messageIds);
  const { campId, orgId } = useNumericRouteParams();
  const env = useEnv();
  const store = useStore();

  const [editingTypeOrTitle, setEditingTypeOrTitle] = useState(false);
  const eventsModel = useModel((env) => new EventsModel(env, orgId));
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

  const [typeId, setTypeId] = useState<number>(1);
  const [typeTitle, setTypeTitle] = useState<string>('');
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventDate, setEventDate] = useState<Dayjs>(dayjs(dates[0]));
  const [invalidDate, setInvalidDate] = useState(false);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [eventLink, setEventLink] = useState<string>('');
  const [eventDescription, setEventDescription] = useState<string>('');
  const [eventParticipants, setEventParticipants] = useState<number | null>(
    null
  );
  const [eventStartTime, setEventStartTime] = useState<Dayjs>(dayjs(dates[0]));
  const [invalidStartTime, setInvalidStartTime] = useState(false);
  const [eventEndTime, setEventEndTime] = useState<Dayjs>(dayjs(dates[1]));
  const [invalidEndTime, setInvalidEndTime] = useState(false);
  const [eventShifts, setEventShifts] = useState<Dayjs[]>([
    dayjs(dates[0]),
    dayjs(dates[0]).add(
      dayjs(dates[1]).diff(dayjs(dates[0]), 'minute') / 2,
      'minute'
    ),
  ]);
  const [updatedShift, setUpdatedShift] = useState<[number, Dayjs]>([
    0,
    dayjs(dates[0]),
  ]);
  const [invalidShiftTime, setInvalidShiftTime] = useState<boolean[]>([
    false,
    false,
  ]);

  const updateShifts = (noShifts: number) => {
    const newShifts: Dayjs[] = [];
    for (let i = 0; i < noShifts; i++) {
      newShifts.push(
        dayjs(eventStartTime).add(
          (dayjs(eventEndTime).diff(dayjs(eventStartTime), 'minute') /
            noShifts) *
            i,
          'minute'
        )
      );
    }
    setEventShifts(newShifts);
    for (let i = 0; i < noShifts; i++) {
      invalidShiftTime[i] = false;
    }
  };

  const removeShift = (index: number) => {
    const newShifts = [...eventShifts];
    newShifts.splice(index, 1);
    setEventShifts(newShifts);
    const newInvalidShiftTime = [...invalidShiftTime];
    newInvalidShiftTime.splice(index, 1);
    setInvalidShiftTime(newInvalidShiftTime);
  };

  const durationHoursMins = (start: Dayjs, end: Dayjs) => {
    const diffMinute = dayjs(end).diff(dayjs(start), 'minute');
    const diffHour = dayjs(end).diff(dayjs(start), 'hour');
    const totTime = dayjs(eventEndTime).diff(dayjs(eventStartTime), 'minute');
    if (diffMinute > totTime || diffMinute < 0) {
      return <Typography color="secondary">{'\u2014'}</Typography>;
    } else if (diffMinute < 60) {
      return (
        <Typography>
          {messages.eventShiftModal.minutes({
            no: diffMinute,
          })}
        </Typography>
      );
    } else {
      if (diffMinute % 60 == 0) {
        return (
          <Typography>
            {messages.eventShiftModal.hours({
              no: diffHour,
            })}
          </Typography>
        );
      } else {
        return (
          <Typography>
            {diffHour} {messages.eventShiftModal.hoursShort()} {diffMinute % 60}{' '}
            {messages.eventShiftModal.minutesShort()}
          </Typography>
        );
      }
    }
  };

  const handleShiftTimeChange = (index: number) => {
    const newShift = dayjs(eventShifts[index]);
    if (
      newShift.isAfter(dayjs(eventShifts[index - 1])) &&
      (eventShifts.length - index > 1
        ? newShift.isBefore(dayjs(eventShifts[index + 1]))
        : newShift.isBefore(dayjs(eventEndTime)))
    ) {
      setInvalidShiftTime([
        ...invalidShiftTime.slice(0, index),
        false,
        ...invalidShiftTime.slice(index + 1),
      ]);
    } else {
      setInvalidShiftTime([
        ...invalidShiftTime.slice(0, index),
        true,
        ...invalidShiftTime.slice(index + 1),
      ]);
    }
  };

  const handleStartEndTimeChange = () => {
    if (dayjs(eventStartTime).isBefore(eventEndTime)) {
      setInvalidStartTime(false);
      updateShifts(eventShifts.length);
    } else {
      setInvalidStartTime(true);
    }

    if (dayjs(eventEndTime).isAfter(eventStartTime)) {
      setInvalidEndTime(false);
      updateShifts(eventShifts.length);
    } else {
      setInvalidEndTime(true);
    }
  };

  const isNotPublishable = () => {
    return (
      invalidDate ||
      invalidStartTime ||
      invalidEndTime ||
      invalidShiftTime.includes(true)
    );
  };

  useEffect(() => {
    handleShiftTimeChange(updatedShift[0]);
  }, [updatedShift]);

  useEffect(() => {
    handleStartEndTimeChange();
  }, [eventStartTime, eventEndTime]);

  async function publishShifts(publish: boolean) {
    eventShifts.forEach(async (shift, index) => {
      await createShift(
        dayjs(shift),
        index < eventShifts.length - 1
          ? dayjs(eventShifts[index + 1])
          : dayjs(eventEndTime),
        publish
      );
    });
    close();
  }

  async function createShift(
    startTime: Dayjs,
    endTime: Dayjs,
    publish: boolean
  ) {
    let startDate: Dayjs = dayjs(eventDate);
    startDate = startDate
      .set('hour', startTime.hour())
      .set('minute', startTime.minute());
    let endDate: Dayjs = dayjs(eventDate);
    endDate = endDate
      .set('hour', endTime.hour())
      .set('minute', endTime.minute());

    const event = await env.apiClient.post<ZetkinEvent, ZetkinEventPostBody>(
      campId
        ? `/api/orgs/${orgId}/campaigns/${campId}/actions`
        : `/api/orgs/${orgId}/actions`,
      {
        activity_id: typeId,
        end_time: endDate.toISOString(),
        info_text: eventDescription,
        location_id: locationId,
        num_participants_required: eventParticipants ? eventParticipants : 0,
        published: publish ? dayjs().toISOString() : null,
        start_time: startDate.toISOString(),
        title: eventTitle,
        url: eventLink,
      }
    );

    store.dispatch(eventCreated(event));
  }

  const events = eventsModel.getParallelEvents(
    eventStartTime.toDate().toISOString(),
    eventEndTime.toDate().toISOString()
  ).data;

  return (
    <Dialog fullWidth maxWidth="md" onClose={close} open={open}>
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
        <Box flex={1} margin={1}>
          <Box />
          <Box margin={1}>
            <ZUIFutures
              futures={{
                types: typesModel.getTypes(),
              }}
            >
              {({ data: { types } }) => {
                return (
                  <EventTypeAutocomplete
                    inEventCreationModal={true}
                    label={messages.eventShiftModal.type()}
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
          </Box>

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
                if (newValue && dayjs(newValue).isValid()) {
                  setInvalidDate(false);
                  setEventDate(newValue);
                } else {
                  setInvalidDate(true);
                }
              }}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    error={invalidDate}
                    helperText={
                      invalidDate
                        ? messages.eventShiftModal.invalidDate()
                        : undefined
                    }
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
              currentEventId={0}
              events={events || []}
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
        <Box flex={1} margin={1}>
          <Typography color="secondary" margin={1} variant="subtitle2">
            {messages.eventShiftModal.event().toUpperCase()}
          </Typography>
          <Box display="flex" flex="space-between">
            <Box flex={1} margin={1}>
              <TimePicker
                ampm={false}
                inputFormat="HH:mm"
                label={messages.eventShiftModal.start()}
                onChange={(newValue) => {
                  if (newValue && newValue.isValid()) {
                    setEventStartTime(newValue);
                  }
                }}
                open={false}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      error={invalidStartTime}
                      helperText={
                        invalidStartTime
                          ? messages.eventShiftModal.invalidTime()
                          : undefined
                      }
                      inputProps={{
                        ...params.inputProps,
                      }}
                      variant="outlined"
                    />
                  );
                }}
                value={dayjs(eventStartTime)}
              />
            </Box>

            <Box flex={1} margin={1}>
              <TimePicker
                ampm={false}
                inputFormat="HH:mm"
                label={messages.eventShiftModal.end()}
                onChange={(newValue) => {
                  if (newValue && newValue.isValid()) {
                    setEventEndTime(newValue);
                  }
                }}
                open={false}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      error={invalidEndTime}
                      helperText={
                        invalidEndTime
                          ? messages.eventShiftModal.invalidTime()
                          : undefined
                      }
                      inputProps={{
                        ...params.inputProps,
                      }}
                    />
                  );
                }}
                value={dayjs(eventEndTime)}
              />
            </Box>

            <Box flex={1} margin={1}>
              <Typography color="secondary" variant="subtitle2">
                {messages.eventShiftModal.eventDuration().toUpperCase()}
              </Typography>
              <Box>{durationHoursMins(eventStartTime, eventEndTime)}</Box>
            </Box>
          </Box>
          <Typography
            color="secondary"
            marginLeft={1}
            marginTop={1}
            variant="subtitle2"
          >
            {messages.eventShiftModal.shiftsHeader().toUpperCase()}
          </Typography>
          <Box
            alignItems="center"
            display="flex"
            marginBottom={1}
            marginLeft={1}
          >
            <Typography flex={3}>
              {messages.eventShiftModal.shifts({ no: eventShifts.length })}
            </Typography>
            <Box flex={4}>
              <Button
                onClick={() => {
                  updateShifts(eventShifts.length + 1);
                }}
                startIcon={<Add />}
                sx={{ margin: 1 }}
                variant="outlined"
              >
                {messages.eventShiftModal.addShift().toUpperCase()}
              </Button>
              {eventShifts.length > 2 && (
                <Button
                  onClick={() => {
                    updateShifts(2);
                  }}
                  sx={{ margin: 1 }}
                  variant="outlined"
                >
                  {messages.eventShiftModal.clear().toUpperCase()}
                </Button>
              )}
            </Box>
          </Box>
          {eventShifts.map((shift, index) => {
            return (
              <Box key={index} alignItems="center" display="flex" margin={1}>
                <Box flex={2}>
                  <TimePicker
                    ampm={false}
                    disabled={index === 0}
                    inputFormat="HH:mm"
                    label={messages.eventShiftModal.shiftStart({
                      no: index + 1,
                    })}
                    onChange={(newValue) => {
                      if (newValue && newValue.isValid()) {
                        setEventShifts([
                          ...eventShifts.slice(0, index),
                          dayjs(newValue),
                          ...eventShifts.slice(index + 1),
                        ]);
                        setUpdatedShift([index, dayjs(newValue)]);
                      }
                    }}
                    open={false}
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          error={invalidShiftTime[index]}
                          helperText={
                            invalidShiftTime[index]
                              ? messages.eventShiftModal.invalidTime()
                              : undefined
                          }
                          inputProps={{
                            ...params.inputProps,
                          }}
                        />
                      );
                    }}
                    value={dayjs(shift)}
                  />
                </Box>
                <Box flex={2} margin={1} marginLeft={2}>
                  <Typography color="secondary" variant="subtitle2">
                    {messages.eventShiftModal.shiftDuration().toUpperCase()}
                  </Typography>
                  {durationHoursMins(
                    shift,
                    eventShifts.length - index > 1
                      ? eventShifts[index + 1]
                      : eventEndTime
                  )}
                </Box>
                <Box display="flex" flex={1} justifyContent="flex-end">
                  {eventShifts.length > 2 && index > 0 && (
                    <IconButton onClick={() => removeShift(index)}>
                      <Close />
                    </IconButton>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="flex-end"
        margin={1}
      >
        <Typography color="secondary" margin={1}>
          {messages.eventShiftModal.noEvents({ no: eventShifts.length })}
        </Typography>
        <Box margin={1}>
          <Button
            disabled={isNotPublishable()}
            onClick={async () => {
              await publishShifts(false);
            }}
            size="large"
            variant="text"
          >
            {messages.eventShiftModal.draft().toUpperCase()}
          </Button>
        </Box>
        <Box margin={1}>
          <Button
            disabled={isNotPublishable()}
            onClick={async () => {
              await publishShifts(true);
            }}
            size="large"
            variant="contained"
          >
            {messages.eventShiftModal.publish().toUpperCase()}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EventShiftModal;
