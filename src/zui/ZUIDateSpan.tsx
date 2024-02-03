import { FC } from 'react';
import { FormattedDate } from 'react-intl';

import messageIds from './l10n/messageIds';
import { Msg } from 'core/i18n';

type ZUIDateSpanProps = {
  end: Date;
  start: Date;
};

const ZUIDateSpan: FC<ZUIDateSpanProps> = ({ end, start }) => {
  const isToday = start.toDateString() === new Date().toDateString();
  const endsOnSameDay = start.toDateString() === end.toDateString();
  const endsOnToday = end.toDateString() === new Date().toDateString();

  return (
    <>
      {isToday && (
        <>
          {endsOnSameDay && <Msg id={messageIds.dateSpan.singleDayToday} />}
          {!endsOnSameDay && (
            <Msg
              id={messageIds.dateSpan.multiDayToday}
              values={{
                endDate: (
                  <FormattedDate day="numeric" month="long" value={end} />
                ),
              }}
            />
          )}
        </>
      )}
      {!isToday && (
        <>
          {endsOnSameDay && (
            <Msg
              id={messageIds.dateSpan.singleDay}
              values={{
                date: (
                  <FormattedDate day="numeric" month="long" value={start} />
                ),
              }}
            />
          )}
          {!endsOnSameDay && (
            <>
              {endsOnToday && (
                <Msg
                  id={messageIds.dateSpan.multiDayEndsToday}
                  values={{
                    startDate: (
                      <FormattedDate day="numeric" month="long" value={start} />
                    ),
                  }}
                />
              )}
              {!endsOnToday && (
                <Msg
                  id={messageIds.dateSpan.multiDay}
                  values={{
                    endDate: (
                      <FormattedDate day="numeric" month="long" value={end} />
                    ),
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

export default ZUIDateSpan;
