import { IntlShape } from 'react-intl';

import messageIds from 'zui/l10n/messageIds';
import { isAllDay } from 'features/calendar/components/utils';
import { injectIntl } from 'core/i18n/useMessages';

export function timeSpanToString(
  start: Date,
  end: Date,
  intl: IntlShape
): string {
  const messages = injectIntl(messageIds.timeSpan, intl);
  const isToday = start.toDateString() === new Date().toDateString();
  const endsOnSameDay = start.toDateString() === end.toDateString();
  const endsOnToday = end.toDateString() === new Date().toDateString();

  const startTime = intl.formatTime(start);
  const endTime = intl.formatTime(end);

  if (isToday && isAllDay(start.toISOString(), end.toDateString())) {
    return messages.singleDayAllDay();
  }

  if (isToday) {
    if (endsOnSameDay) {
      return messages.singleDayToday({ end: endTime, start: startTime });
    } else {
      return messages.multiDayToday({
        end: endTime,
        endDate: intl.formatDate(end, { day: 'numeric', month: 'long' }),
        start: startTime,
      });
    }
  } else {
    if (endsOnSameDay) {
      return messages.singleDay({
        date: intl.formatDate(start, { day: 'numeric', month: 'long' }),
        end: endTime,
        start: startTime,
      });
    } else {
      if (endsOnToday) {
        return messages.multiDayEndsToday({
          end: endTime,
          start: startTime,
          startDate: intl.formatDate(start, { day: 'numeric', month: 'long' }),
        });
      } else {
        return messages.multiDay({
          end: endTime,
          endDate: intl.formatDate(end, { day: 'numeric', month: 'long' }),
          start: startTime,
          startDate: intl.formatDate(start, { day: 'numeric', month: 'long' }),
        });
      }
    }
  }
}
