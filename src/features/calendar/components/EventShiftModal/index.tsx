import { Close } from '@mui/icons-material';
import { Box, Button, Dialog, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { FC, useState } from 'react';

import EventShiftDetails from './EventShiftDetails';
import EventShiftTime from './EventShiftTime';
import messageIds from 'features/events/l10n/messageIds';
import useCreateEvent from 'features/events/hooks/useCreateEvent';
import { useMessages } from 'core/i18n';
import useNumericRouteParams from 'core/hooks/useNumericRouteParams';
import { ZetkinEvent } from 'utils/types/zetkin';

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

  const [type, setType] = useState<ZetkinEvent['activity']>(null);
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventDate, setEventDate] = useState<Dayjs>(startDate);
  const [invalidDate, setInvalidDate] = useState(false);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [eventLink, setEventLink] = useState<string>('');
  const [eventDescription, setEventDescription] = useState<string>('');
  const [eventParticipants, setEventParticipants] = useState<number | null>(2);
  const [eventStartTime, setEventStartTime] = useState<Dayjs>(startDate);
  const [invalidStartTime, setInvalidStartTime] = useState(false);
  const [eventEndTime, setEventEndTime] = useState<Dayjs>(endDate);
  const [invalidEndTime, setInvalidEndTime] = useState(false);
  const [eventShifts, setEventShifts] = useState<Dayjs[]>([
    startDate,
    startDate.add(endDate.diff(startDate, 'minute') / 2, 'minute'),
  ]);
  const [invalidShiftTimes, setInvalidShiftTimes] = useState<boolean[]>([
    false,
    false,
  ]);

  const createEvent = useCreateEvent(orgId);

  const isNotPublishable =
    invalidDate ||
    invalidStartTime ||
    invalidEndTime ||
    invalidShiftTimes.includes(true);

  async function publishShifts(publish: boolean) {
    eventShifts.forEach(async (shift, index) => {
      const endTime =
        index < eventShifts.length - 1
          ? dayjs(eventShifts[index + 1])
          : dayjs(eventEndTime);

      let startDate: Dayjs = dayjs(eventDate);
      startDate = startDate
        .set('hour', shift.hour() + 2)
        .set('minute', shift.minute());

      let endDate: Dayjs = dayjs(eventDate);
      endDate = endDate
        .set('hour', endTime.hour() + 2)
        .set('minute', endTime.minute());

      const now = dayjs();
      const published = startDate < now ? startDate : now;

      createEvent(
        {
          activity_id: type ? type.id : null,
          campaign_id: campId,
          end_time: endDate.toISOString(),
          info_text: eventDescription,
          location_id: locationId,
          num_participants_required: eventParticipants ? eventParticipants : 0,
          published: publish ? published.toISOString() : null,
          start_time: startDate.toISOString(),
          title: eventTitle || null,
          url: eventLink,
        },
        false
      );
    });
    close();
  }

  return (
    <Dialog maxWidth="lg" open={open}>
      <Box display="flex" flexDirection="column" overflow="hidden">
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
        <Box
          display="flex"
          gap={3}
          justifyContent="space-between"
          padding={2}
          sx={{ overflowY: 'auto' }}
        >
          <Box flex={1}>
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
              onNewType={(newType) => setType(newType)}
              onTypeChange={(newType) => {
                if (newType) {
                  setType(newType);
                } else {
                  setType(null);
                }
              }}
              orgId={orgId}
              type={type}
            />
          </Box>
          <Box flex={1}>
            <EventShiftTime
              eventEndTime={eventEndTime}
              eventShifts={eventShifts}
              eventStartTime={eventStartTime}
              invalidShiftTimes={invalidShiftTimes}
              onEventEndTimeChange={(newEndTime) => {
                if (newEndTime && newEndTime.isValid()) {
                  setEventEndTime(newEndTime);
                }
              }}
              onEventShiftsChange={(newShifts) => setEventShifts(newShifts)}
              onEventStartTimeChange={(newStartTime) => {
                if (newStartTime && newStartTime.isValid()) {
                  setEventStartTime(newStartTime);
                }
              }}
              onInvalidEndTimeChange={(isInvalid) =>
                setInvalidEndTime(isInvalid)
              }
              onInvalidShiftTimesChange={(newInvalidShiftTimes) =>
                setInvalidShiftTimes(newInvalidShiftTimes)
              }
              onInvalidStartTimeChange={(isInvalid) =>
                setInvalidStartTime(isInvalid)
              }
              startDate={startDate}
            />
          </Box>
        </Box>
        <Box
          alignItems="center"
          display="flex"
          gap={2}
          justifyContent="flex-end"
          padding={2}
        >
          <Typography color="secondary">
            {messages.eventShiftModal.noEvents({ no: eventShifts.length })}
          </Typography>
          <Button
            disabled={isNotPublishable}
            onClick={async () => {
              await publishShifts(false);
            }}
            variant="text"
          >
            {messages.eventShiftModal.draft().toUpperCase()}
          </Button>
          <Button
            disabled={isNotPublishable}
            onClick={async () => {
              await publishShifts(true);
            }}
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
