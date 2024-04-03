import { TimeField } from '@mui/x-date-pickers-pro';
import { Add, Close } from '@mui/icons-material';
import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { FC, useEffect, useState } from 'react';

import EventShiftDetails from './EventShiftDetails';
import messageIds from 'features/events/l10n/messageIds';
import useCreateEvent from 'features/events/hooks/useCreateEvent';
import { useMessages } from 'core/i18n';
import useNumericRouteParams from 'core/hooks/useNumericRouteParams';

interface EventShiftModalProps {
  dates: [Date, Date];
  open: boolean;
  close: () => void;
}

const EventShiftModal: FC<EventShiftModalProps> = ({ close, dates, open }) => {
  const [startDate, endDate] = dates.map((date) =>
    dayjs(date.toISOString().split('Z')[0])
  );

  const messages = useMessages(messageIds);
  const { orgId, campId } = useNumericRouteParams();

  const [typeId, setTypeId] = useState<number>(1);
  const [typeTitle, setTypeTitle] = useState<string>('');
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventDate, setEventDate] = useState<Dayjs>(startDate);
  const [invalidDate, setInvalidDate] = useState(false);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [eventLink, setEventLink] = useState<string>('');
  const [eventDescription, setEventDescription] = useState<string>('');
  const [eventParticipants, setEventParticipants] = useState<number | null>(
    null
  );
  const [eventStartTime, setEventStartTime] = useState<Dayjs>(startDate);
  const [invalidStartTime, setInvalidStartTime] = useState(false);
  const [eventEndTime, setEventEndTime] = useState<Dayjs>(endDate);
  const [invalidEndTime, setInvalidEndTime] = useState(false);
  const [eventShifts, setEventShifts] = useState<Dayjs[]>([
    startDate,
    startDate.add(endDate.diff(startDate, 'minute') / 2, 'minute'),
  ]);
  const [updatedShift, setUpdatedShift] = useState<[number, Dayjs]>([
    0,
    startDate,
  ]);
  const [invalidShiftTime, setInvalidShiftTime] = useState<boolean[]>([
    false,
    false,
  ]);

  const createEvent = useCreateEvent(orgId);

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
      .set('hour', startTime.hour() + 2)
      .set('minute', startTime.minute());
    let endDate: Dayjs = dayjs(eventDate);
    endDate = endDate
      .set('hour', endTime.hour() + 2)
      .set('minute', endTime.minute());

    createEvent(
      {
        activity_id: typeId >= 0 ? typeId : null,
        campaign_id: campId,
        end_time: endDate.toISOString(),
        info_text: eventDescription,
        location_id: locationId,
        num_participants_required: eventParticipants ? eventParticipants : 0,
        published: publish ? dayjs().toISOString() : null,
        start_time: startDate.toISOString(),
        title: eventTitle,
        url: eventLink,
      },
      false
    );
  }

  return (
    <Dialog fullWidth maxWidth="md" open={open}>
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
        <EventShiftDetails
          eventDate={eventDate}
          eventDescription={eventDescription}
          eventEndTime={eventEndTime}
          eventLink={eventLink}
          eventParticipants={eventParticipants}
          eventStartTime={eventStartTime}
          eventTitle={eventTitle}
          locationId={locationId}
          onEventDateChange={(newDate) => {
            if (newDate && newDate.isValid()) {
              setInvalidDate(false);
              setEventDate(newDate);
            } else {
              setInvalidDate(true);
            }
          }}
          onEventDescriptionChange={(newDescription) =>
            setEventDescription(newDescription)
          }
          onEventLinkChange={(newLink) => setEventLink(newLink)}
          onEventParticipantsChange={(newValue) =>
            setEventParticipants(newValue)
          }
          onEventTitleChange={(newTitle) => setEventTitle(newTitle)}
          onLocationIdChange={(newId) => setLocationId(newId)}
          onNewType={(newType) => {
            setTypeId(newType.id);
            setTypeTitle(newType.title);
          }}
          onTypeChange={(newType) => {
            if (newType) {
              setTypeId(newType.id);
              setTypeTitle(newType.title);
            } else {
              setTypeId(-1);
              setTypeTitle(messages.type.uncategorized());
            }
          }}
          orgId={orgId}
          typeId={typeId}
          typeTitle={typeTitle}
        />
        <Box bgcolor="background.secondary" flex={1} height="100%" margin={1}>
          <Typography color="secondary" margin={1} variant="body2">
            {messages.eventShiftModal.event().toUpperCase()}
          </Typography>
          <Box display="flex" flex="space-between">
            <Box flex={1} margin={1}>
              <TimeField
                ampm={false}
                disableIgnoringDatePartForTimeValidation={true}
                format="HH:mm"
                fullWidth
                label={messages.eventShiftModal.start()}
                onChange={(newStartTime) => {
                  if (newStartTime && newStartTime.isValid()) {
                    setEventStartTime(newStartTime);
                  }
                }}
                value={dayjs(eventStartTime)}
              />
            </Box>
            <Box flex={1} margin={1}>
              <TimeField
                ampm={false}
                disableIgnoringDatePartForTimeValidation={true}
                format="HH:mm"
                fullWidth
                label={messages.eventShiftModal.end()}
                onChange={(newEndTime) => {
                  if (newEndTime && newEndTime.isValid()) {
                    setEventEndTime(newEndTime);
                  }
                }}
                value={dayjs(eventEndTime)}
              />
            </Box>
            <Box flex={1} margin={1}>
              <Typography color="secondary" variant="body2">
                {messages.eventShiftModal.eventDuration().toUpperCase()}
              </Typography>
              <Box>{durationHoursMins(eventStartTime, eventEndTime)}</Box>
            </Box>
          </Box>
          <Typography
            color="secondary"
            marginLeft={1}
            marginTop={1}
            variant="body2"
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
                  {messages.eventShiftModal.reset().toUpperCase()}
                </Button>
              )}
            </Box>
          </Box>
          {eventShifts.map((shift, index) => {
            return (
              <Box key={index} alignItems="center" display="flex" margin={1}>
                <Box flex={2}>
                  <TimeField
                    ampm={false}
                    disabled={index === 0}
                    format="HH:mm"
                    label={messages.eventShiftModal.shiftStart({
                      no: index + 1,
                    })}
                    onChange={(newShiftStart) => {
                      if (newShiftStart && newShiftStart.isValid()) {
                        setEventShifts([
                          ...eventShifts.slice(0, index),
                          dayjs(newShiftStart),
                          ...eventShifts.slice(index + 1),
                        ]);
                        setUpdatedShift([index, dayjs(newShiftStart)]);
                      }
                    }}
                    value={dayjs(shift)}
                  />
                </Box>
                <Box flex={2} margin={1} marginLeft={2}>
                  <Typography color="secondary" variant="body2">
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
