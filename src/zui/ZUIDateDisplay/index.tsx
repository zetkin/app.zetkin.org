import { FormattedDate, FormattedTime } from 'react-intl';
import { format as dateFormat, isSameDay, isToday, isTomorrow } from 'date-fns';
import React from 'react';

type ZUIDateDisplayFormats =
  | 'full'
  | 'time'
  | 'short'
  | 'range'
  | 'log'
  | undefined;

interface ZUIDateDisplayProps {
  displayFormat?: ZUIDateDisplayFormats;
  timestamp: string;
  endTimestamp?: string;
  showRelative?: boolean;
}

const ZUIDateDisplay: React.FunctionComponent<ZUIDateDisplayProps> = ({
  endTimestamp,
  showRelative,
  timestamp,
  displayFormat,
}) => {
  const endDate = endTimestamp ? new Date(endTimestamp) : null;
  const startDate = new Date(timestamp);

  const endsOnSameDay = endDate ? isSameDay(startDate, endDate) : false;

  const getRelativeTag = () => {
    if (!showRelative) {
      return '';
    }
    if (isToday(startDate)) {
      return 'Today ';
    }
    if (isTomorrow(startDate)) {
      return 'Tomorrow ';
    }
    return '';
  };

  const relativeTag = getRelativeTag();

  return (
    <>
      {displayFormat === 'full' && (
        <>
          {relativeTag}
          <FormattedDate
            day="numeric"
            month="long"
            value={timestamp}
            weekday="long"
            year="numeric"
          />
        </>
      )}
      {displayFormat === 'time' && (
        <>
          {relativeTag}
          <FormattedDate
            day="numeric"
            month="long"
            value={timestamp}
            weekday="long"
            year="numeric"
          />
          {' - '}
          <FormattedTime
            hour="2-digit"
            hourCycle="h24"
            minute="2-digit"
            value={timestamp}
          />
        </>
      )}
      {displayFormat === 'short' && (
        <FormattedDate
          day="2-digit"
          month="2-digit"
          value={timestamp}
          year="2-digit"
        />
      )}
      {displayFormat === 'range' &&
        (endsOnSameDay ? (
          <>
            {relativeTag}
            <FormattedDate
              day="numeric"
              month="long"
              value={timestamp}
              weekday="long"
              year="numeric"
            />
            {' | '}
            <FormattedTime
              hour="2-digit"
              hourCycle="h24"
              minute="2-digit"
              value={timestamp}
            />
            {' - '}
            <FormattedTime
              hour="2-digit"
              hourCycle="h24"
              minute="2-digit"
              value={endTimestamp}
            />
          </>
        ) : (
          <>
            {relativeTag}
            <FormattedDate
              day="numeric"
              month="long"
              value={timestamp}
              weekday="long"
              year="numeric"
            />
            {', '}
            <FormattedTime
              hour="2-digit"
              hourCycle="h24"
              minute="2-digit"
              value={timestamp}
            />
            {' - '}
            <FormattedDate
              day="numeric"
              month="long"
              value={endTimestamp}
              weekday="long"
              year="numeric"
            />
            {', '}
            <FormattedTime
              hour="2-digit"
              hourCycle="h24"
              minute="2-digit"
              value={endTimestamp}
            />
          </>
        ))}
      {displayFormat === 'log' && (
        <>{dateFormat(startDate, 'dd-MM-yyyy - HH:mm:ss')}</>
      )}
    </>
  );
};

export default ZUIDateDisplay;
