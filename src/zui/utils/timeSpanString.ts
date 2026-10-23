import { IntlShape } from 'react-intl';

import messageIds from 'zui/l10n/messageIds';
import { isAllDay } from 'features/calendar/components/utils';
import { injectIntl } from 'core/i18n/useMessages';

export function timeSpanToString(
  start: Temporal.PlainDateTime,
  end: Temporal.PlainDateTime,
  intl: IntlShape
): string {
  const messages = injectIntl(messageIds.timeSpan, intl);
  const today = Temporal.Now.plainDateTimeISO();
  const isToday = start.toPlainDate().equals(today);
  const endsOnSameDay = start.toPlainDate().equals(end.toPlainDate());
  const endsOnToday = end.toPlainDate().equals(today);

  const startTime = intl.formatTime(start);
  const endTime = intl.formatTime(end);

  if (isToday && isAllDay(start, end)) {
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
