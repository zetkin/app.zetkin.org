import { FC } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';

import { isAllDay } from 'features/calendar/components/utils';
import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';

type ZUITimeSpanProps = {
  end: Date;
  start: Date;
};

const ZUITimeSpan: FC<ZUITimeSpanProps> = ({ end, start }) => {
  const isToday = start.toDateString() === new Date().toDateString();
  const endsOnSameDay = start.toDateString() === end.toDateString();
  const endsOnToday = end.toDateString() === new Date().toDateString();

  const startTime = <FormattedTime value={start} />;
  const endTime = <FormattedTime value={end} />;

  if (isAllDay(start.toISOString(), end.toDateString())) {
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
                endDate: (
                  <FormattedDate day="numeric" month="long" value={end} />
                ),
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
                date: (
                  <FormattedDate day="numeric" month="long" value={start} />
                ),
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
                    startDate: (
                      <FormattedDate day="numeric" month="long" value={start} />
                    ),
                  }}
                />
              )}
              {!endsOnToday && (
                <Msg
                  id={messageIds.timeSpan.multiDay}
                  values={{
                    end: endTime,
                    endDate: (
                      <FormattedDate day="numeric" month="long" value={end} />
                    ),
                    start: startTime,
                    startDate: (
                      <FormattedDate day="numeric" month="long" value={start} />
                    ),
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
