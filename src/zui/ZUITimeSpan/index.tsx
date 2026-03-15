import { FC } from 'react';
import { useFormatter } from 'next-intl';

import { isAllDay } from 'features/calendar/components/utils';
import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';

type ZUITimeSpanProps = {
  end: Date;
  start: Date;
};

const ZUITimeSpan: FC<ZUITimeSpanProps> = ({ end, start }) => {
  const format = useFormatter();
  const isToday = start.toDateString() === new Date().toDateString();
  const endsOnSameDay = start.toDateString() === end.toDateString();
  const endsOnToday = end.toDateString() === new Date().toDateString();

  const timeOpts = { hour: 'numeric' as const, minute: 'numeric' as const };

  const startTime = format.dateTime(start, timeOpts);
  const endTime = format.dateTime(end, timeOpts);

  const startDate = format.dateTime(start, { dateStyle: 'medium' as const });
  const endDate = format.dateTime(end, { dateStyle: 'medium' as const });

  if (isToday && isAllDay(start.toISOString(), end.toDateString())) {
    return <Msg id={messageIds.timeSpan.singleDayAllDay} />;
  }

  return (
    <>
      {isToday && (
        <>
          {endsOnSameDay && (
            <Msg
              id={messageIds.timeSpan.singleDayToday}
              values={{ end: endTime, start: startTime }}
            />
          )}
          {!endsOnSameDay && (
            <Msg
              id={messageIds.timeSpan.multiDayToday}
              values={{
                end: endTime,
                endDate: endDate,
                start: startTime,
              }}
            />
          )}
        </>
      )}
      {!isToday && (
        <>
          {endsOnSameDay && (
            <Msg
              id={messageIds.timeSpan.singleDay}
              values={{
                date: startDate,
                end: endTime,
                start: startTime,
              }}
            />
          )}
          {!endsOnSameDay && (
            <>
              {endsOnToday && (
                <Msg
                  id={messageIds.timeSpan.multiDayEndsToday}
                  values={{
                    end: endTime,
                    start: startTime,
                    startDate: startDate,
                  }}
                />
              )}
              {!endsOnToday && (
                <Msg
                  id={messageIds.timeSpan.multiDay}
                  values={{
                    end: endTime,
                    endDate: endDate,
                    start: startTime,
                    startDate: startDate,
                  }}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default ZUITimeSpan;
