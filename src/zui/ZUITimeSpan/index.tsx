import { FC } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';

import { isAllDay } from 'features/calendar/components/utils';
import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import { plainDateTimeFromLegacyDate } from 'utils/dateUtils';

type ZUITimeSpanProps = {
  end: Date;
  start: Date;
};

const ZUITimeSpan: FC<ZUITimeSpanProps> = ({ end, start }) => {
  const today = Temporal.Now.plainDateISO();
  const startsAt = plainDateTimeFromLegacyDate(start);
  const endsAt = plainDateTimeFromLegacyDate(end);
  const isToday = startsAt.toPlainDate().equals(today);
  const endsOnSameDay = startsAt.toPlainDate().equals(endsAt.toPlainDate());
  const endsOnToday = endsAt.toPlainDate().equals(today);

  const startTime = <FormattedTime value={start} />;
  const endTime = <FormattedTime value={end} />;

  const startDate = <FormattedDate dateStyle="medium" value={start} />;
  const endDate = <FormattedDate dateStyle="medium" value={end} />;

  if (isToday && isAllDay(startsAt, endsAt)) {
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
