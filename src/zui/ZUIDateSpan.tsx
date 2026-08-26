import { FC } from 'react';
import { useFormatter } from 'next-intl';

import messageIds from './l10n/messageIds';
import { Msg } from 'core/i18n';

type ZUIDateSpanProps = {
  end: Date;
  start: Date;
};

const ZUIDateSpan: FC<ZUIDateSpanProps> = ({ end, start }) => {
  const format = useFormatter();
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
                  <>
                    {format.dateTime(end, {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </>
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
                  <>
                    {format.dateTime(start, {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </>
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
                      <>
                        {format.dateTime(start, {
                          day: 'numeric',
                          month: 'long',
                        })}
                      </>
                    ),
                  }}
                />
              )}
              {!endsOnToday && (
                <Msg
                  id={messageIds.dateSpan.multiDay}
                  values={{
                    endDate: (
                      <>
                        {format.dateTime(end, {
                          day: 'numeric',
                          month: 'long',
                        })}
                      </>
                    ),
                    startDate: (
                      <>
                        {format.dateTime(start, {
                          day: 'numeric',
                          month: 'long',
                        })}
                      </>
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
