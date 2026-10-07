import { FC } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';

import { isAllDay } from 'features/calendar/components/utils';
import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import { legacyDateFromPlainDateTime } from 'utils/dateUtils';

type ZUITimeSpanProps = {
  end: Temporal.PlainDateTime;
  start: Temporal.PlainDateTime;
};

const ZUITimeSpan: FC<ZUITimeSpanProps> = ({ end, start }) => {
  const today = Temporal.Now.plainDateISO();
  const isToday = start.toPlainDate().equals(today);
  const endsOnSameDay = end.toPlainDate().equals(end.toPlainDate());
  const endsOnToday = end.toPlainDate().equals(today);

  const startTime = (
    <FormattedTime value={legacyDateFromPlainDateTime(start)} />
  );
  const endTime = <FormattedTime value={legacyDateFromPlainDateTime(end)} />;

  const startDate = (
    <FormattedDate
      dateStyle="medium"
      value={legacyDateFromPlainDateTime(start)}
    />
  );
  const endDate = (
    <FormattedDate
      dateStyle="medium"
      value={legacyDateFromPlainDateTime(end)}
    />
  );

  if (isToday && isAllDay(start, end)) {
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
