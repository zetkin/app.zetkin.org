import { TimeField } from '@mui/x-date-pickers-pro';
import { Add, Close } from '@mui/icons-material';
import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { FC, useEffect, useState } from 'react';

import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';

interface DurationHoursMinsProps {
  end: Dayjs;
  start: Dayjs;
}

const DurationHoursMins: FC<DurationHoursMinsProps> = ({ end, start }) => {
  const messages = useMessages(messageIds);
  const diffMinute = dayjs(end).diff(dayjs(start), 'minute');
  const diffHour = dayjs(end).diff(dayjs(start), 'hour');
  const totTime = end.diff(start, 'minute');

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

interface EventShiftTimeProps {
  eventStartTime: Dayjs;
  eventShifts: Dayjs[];
  eventEndTime: Dayjs;
  invalidShiftTimes: boolean[];
  onEventEndTimeChange: (newEndTime: Dayjs | null) => void;
  onEventShiftsChange: (newShifts: Dayjs[]) => void;
  onEventStartTimeChange: (newStartTime: Dayjs | null) => void;
  onInvalidEndTimeChange: (isInvalid: boolean) => void;
  onInvalidShiftTimesChange: (newShiftTimes: boolean[]) => void;
  onInvalidStartTimeChange: (isInvalid: boolean) => void;
  startDate: Dayjs;
}

const EventShiftTime: FC<EventShiftTimeProps> = ({
  eventEndTime,
  eventShifts,
  eventStartTime,
  invalidShiftTimes,
  onEventEndTimeChange,
  onEventShiftsChange,
  onEventStartTimeChange,
  onInvalidEndTimeChange,
  onInvalidShiftTimesChange,
  onInvalidStartTimeChange,
  startDate,
}) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();

  const [updatedShift, setUpdatedShift] = useState<[number, Dayjs]>([
    0,
    startDate,
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
    onEventShiftsChange(newShifts);
    for (let i = 0; i < noShifts; i++) {
      invalidShiftTimes[i] = false;
    }
  };

  useEffect(() => {
    const index = updatedShift[0];
    const newShift = dayjs(eventShifts[index]);
    if (
      newShift.isAfter(dayjs(eventShifts[index - 1])) &&
      (eventShifts.length - index > 1
        ? newShift.isBefore(dayjs(eventShifts[index + 1]))
        : newShift.isBefore(dayjs(eventEndTime)))
    ) {
      onInvalidShiftTimesChange([
        ...invalidShiftTimes.slice(0, index),
        false,
        ...invalidShiftTimes.slice(index + 1),
      ]);
    } else {
      onInvalidShiftTimesChange([
        ...invalidShiftTimes.slice(0, index),
        true,
        ...invalidShiftTimes.slice(index + 1),
      ]);
    }
  }, [updatedShift]);

  useEffect(() => {
    if (dayjs(eventStartTime).isBefore(eventEndTime)) {
      onInvalidStartTimeChange(false);
      updateShifts(eventShifts.length);
    } else {
      onInvalidStartTimeChange(true);
    }

    if (dayjs(eventEndTime).isAfter(eventStartTime)) {
      onInvalidEndTimeChange(false);
      updateShifts(eventShifts.length);
    } else {
      onInvalidEndTimeChange(true);
    }
  }, [eventStartTime, eventEndTime]);

  return (
    <Box
      bgcolor={theme.palette.grey[100]}
      display="flex"
      flexDirection="column"
      gap={2}
      padding={2}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography color="secondary" variant="body2">
          {messages.eventShiftModal.event().toUpperCase()}
        </Typography>
        <Box display="flex" gap={2}>
          <TimeField
            ampm={false}
            disableIgnoringDatePartForTimeValidation={true}
            format="HH:mm"
            fullWidth
            label={messages.eventShiftModal.start()}
            onChange={(newStartTime) => onEventStartTimeChange(newStartTime)}
            sx={{ flex: 1 }}
            value={dayjs(eventStartTime)}
          />
          <TimeField
            ampm={false}
            disableIgnoringDatePartForTimeValidation={true}
            format="HH:mm"
            fullWidth
            label={messages.eventShiftModal.end()}
            onChange={(newEndTime) => onEventEndTimeChange(newEndTime)}
            sx={{ flex: 1 }}
            value={dayjs(eventEndTime)}
          />
          <Box flex={1}>
            <Typography color="secondary" variant="body2">
              {messages.eventShiftModal.eventDuration().toUpperCase()}
            </Typography>
            <DurationHoursMins end={eventEndTime} start={eventStartTime} />
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography color="secondary" variant="body2">
          {messages.eventShiftModal.shiftsHeader().toUpperCase()}
        </Typography>
        <Box alignItems="center" display="flex">
          <Typography flex={3}>
            {messages.eventShiftModal.shifts({ no: eventShifts.length })}
          </Typography>
          <Box flex={4}>
            <Button
              onClick={() => {
                updateShifts(eventShifts.length + 1);
              }}
              size="small"
              startIcon={<Add />}
              sx={{ marginRight: 2 }}
              variant="outlined"
            >
              {messages.eventShiftModal.addShift().toUpperCase()}
            </Button>
            {eventShifts.length > 2 && (
              <Button onClick={() => updateShifts(2)} variant="outlined">
                {messages.eventShiftModal.reset().toUpperCase()}
              </Button>
            )}
          </Box>
        </Box>
        {eventShifts.map((shift, index) => {
          return (
            <Box key={index} alignItems="center" display="flex" gap={2}>
              <TimeField
                ampm={false}
                disabled={index === 0}
                format="HH:mm"
                label={messages.eventShiftModal.shiftStart({
                  no: index + 1,
                })}
                onChange={(newShiftStart) => {
                  if (newShiftStart && newShiftStart.isValid()) {
                    onEventShiftsChange([
                      ...eventShifts.slice(0, index),
                      dayjs(newShiftStart),
                      ...eventShifts.slice(index + 1),
                    ]);
                    setUpdatedShift([index, dayjs(newShiftStart)]);
                  }
                }}
                sx={{ flex: 2 }}
                value={dayjs(shift)}
              />
              <Box flex={2}>
                <Typography color="secondary" variant="body2">
                  {messages.eventShiftModal.shiftDuration().toUpperCase()}
                </Typography>
                <DurationHoursMins
                  end={
                    eventShifts.length - index > 1
                      ? eventShifts[index + 1]
                      : eventEndTime
                  }
                  start={shift}
                />
              </Box>
              <Box display="flex" flex={1} justifyContent="flex-end">
                {eventShifts.length > 2 && index > 0 && (
                  <IconButton
                    onClick={() => {
                      const newShifts = [...eventShifts];
                      newShifts.splice(index, 1);
                      onEventShiftsChange(newShifts);

                      const newInvalidShiftTime = [...invalidShiftTimes];
                      newInvalidShiftTime.splice(index, 1);
                      onInvalidShiftTimesChange(newInvalidShiftTime);
                    }}
                  >
                    <Close />
                  </IconButton>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default EventShiftTime;
