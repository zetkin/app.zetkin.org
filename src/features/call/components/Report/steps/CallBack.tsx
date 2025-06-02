import { FC, useEffect, useRef, useState } from 'react';
import { Box, Stack } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { Looks3, Looks4, LooksOne, LooksTwo } from '@mui/icons-material';

import { Report } from '..';
import ZUIAutocomplete from 'zui/components/ZUIAutocomplete';
import ZUIDateField from 'zui/components/ZUIDateField';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import ZUIDate from 'zui/ZUIDate';
import ZUIDateTime from 'zui/ZUIDateTime';
import StepBase from './StepBase';

type Props = {
  onReportUpdate: (updatedReport: Report) => void;
  report: Report;
};

const CallBack: FC<Props> = ({ onReportUpdate, report }) => {
  const messages = useMessages(messageIds);
  const timeInputRef = useRef<HTMLInputElement | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const today = dayjs();
  const tomorrow = today.add(1, 'day');
  const initialDate = dayjs(report.callBackAfter || tomorrow);

  const options: { label: string; value: string }[] = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0') + ':00';

    options.push({
      label:
        i == 0
          ? messages.report.steps.callBack.question.anyTimeOptionLabel()
          : hour,
      value: i == 0 ? 'any' : hour,
    });
  }
  const initialTime =
    options.find((o) => o.value == report.callBackAfter?.slice(-5)) ||
    options[0];

  const [time, setTime] =
    useState<{ label: string; value: string }>(initialTime);
  const [date, setDate] = useState<Dayjs>(initialDate);

  const getNextMonday = () => {
    const indexOfToday = today.day();
    return today.add(indexOfToday == 0 ? 1 : 8 - indexOfToday, 'day');
  };

  const callBackTime = time.value == 'any' ? '00:00' : time.value;
  const month = (date.month() + 1).toString().padStart(2, '0');
  const day = date.date().toString().padStart(2, '0');

  const callBackAfter = `${date.year()}-${month}-${day}T${callBackTime}`;

  const callBackLaterToday = () => {
    setDate(today);
    const currentHour = today.hour();

    let callBackHour: number = currentHour + 3;
    if (currentHour == 23) {
      //If it's after 23.00 and you press this button,
      //we set the call back time to "any time tomorrow"
      setTime(options[0]);
      setDate(today.add(1, 'day'));
    } else {
      let hourString: string = callBackHour.toString().padStart(2, '0') + ':00';
      if (currentHour >= 21) {
        //If it's after 21.00 we add 1 hour to the call back time
        //instead of 3.
        callBackHour = currentHour + 1;
        hourString = callBackHour.toString().padStart(2, '0') + ':00';
      }
      setTime({ label: `After ${hourString}`, value: hourString });
    }
  };

  const callBackTomorrow = () => {
    setDate(today.add(1, 'day'));
    setTime(options[0]);
  };

  const callBackNextWeek = () => {
    setDate(getNextMonday());
    setTime(options[0]);
  };

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      const dateInputIsActive = dateInputRef.current == document.activeElement;
      const timeInputIsActive = timeInputRef.current == document.activeElement;

      const focusIsOutsideInputs = !dateInputIsActive && !timeInputIsActive;

      if (focusIsOutsideInputs) {
        if (ev.key == '1') {
          onReportUpdate({
            ...report,
            callBackAfter,
            step: 'organizerAction',
          });
        } else if (ev.key == '2') {
          callBackLaterToday();
        } else if (ev.key == '3') {
          callBackTomorrow();
        } else if (ev.key == '4') {
          callBackNextWeek();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [callBackAfter]);

  return (
    <StepBase
      state="active"
      title={<Msg id={messageIds.report.steps.callBack.question.title} />}
    >
      <Stack sx={{ gap: '0.5rem' }}>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <ZUIDateField
            disablePast
            fullWidth
            inputRef={dateInputRef}
            label={messages.report.steps.callBack.question.dateLabel()}
            onChange={(newDate) => {
              if (newDate) {
                setDate(newDate);
              }
            }}
            value={dayjs(date)}
          />
          <ZUIAutocomplete
            fullWidth
            inputRef={timeInputRef}
            label={messages.report.steps.callBack.question.timeLabel()}
            multiple={false}
            onChange={(newValue) => {
              if (newValue) {
                setTime(newValue);
              }
            }}
            options={options}
            value={time}
          />
        </Box>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
          <ZUIText variant="bodySmRegular">
            <Msg
              id={messageIds.report.steps.callBack.question.examples.title}
            />
          </ZUIText>
          <ZUIButton
            label={messages.report.steps.callBack.question.examples.today()}
            onClick={() => callBackLaterToday()}
            size="small"
            startIcon={LooksTwo}
          />
          <ZUIButton
            label={messages.report.steps.callBack.question.examples.tomorrow()}
            onClick={() => callBackTomorrow()}
            size="small"
            startIcon={Looks3}
          />
          <ZUIButton
            label={messages.report.steps.callBack.question.examples.nextWeek()}
            onClick={() => callBackNextWeek()}
            size="small"
            startIcon={Looks4}
          />
        </Box>
        <ZUIButton
          label={messages.report.steps.callBack.question.callBackButtonLabel({
            date:
              time.value == 'any' ? (
                <ZUIDate datetime={callBackAfter} />
              ) : (
                <ZUIDateTime datetime={callBackAfter} />
              ),
          })}
          onClick={() => {
            onReportUpdate({
              ...report,
              callBackAfter,
              step: 'organizerAction',
            });
          }}
          startIcon={LooksOne}
          variant="secondary"
        />
      </Stack>
    </StepBase>
  );
};

export default CallBack;
