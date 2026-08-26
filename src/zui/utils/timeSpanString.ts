import { useFormatter, useTranslations } from 'next-intl';

import messageIds from 'zui/l10n/messageIds';
import { isAllDay } from 'features/calendar/components/utils';
import { injectTranslator } from 'core/i18n/useMessages';

type Formatter = ReturnType<typeof useFormatter>;
type TranslatorFunc = ReturnType<typeof useTranslations>;

export function timeSpanToString(
  start: Date,
  end: Date,
  t: TranslatorFunc,
  formatter: Formatter
): string {
  const messages = injectTranslator(messageIds.timeSpan, t);
  const isToday = start.toDateString() === new Date().toDateString();
  const endsOnSameDay = start.toDateString() === end.toDateString();
  const endsOnToday = end.toDateString() === new Date().toDateString();

  const startTime = formatter.dateTime(start, {
    hour: 'numeric',
    minute: 'numeric',
  });
  const endTime = formatter.dateTime(end, {
    hour: 'numeric',
    minute: 'numeric',
  });

  if (isToday && isAllDay(start.toISOString(), end.toDateString())) {
    return messages.singleDayAllDay();
  }

  if (isToday) {
    if (endsOnSameDay) {
      return messages.singleDayToday({ end: endTime, start: startTime });
    } else {
      return messages.multiDayToday({
        end: endTime,
        endDate: formatter.dateTime(end, { day: 'numeric', month: 'long' }),
        start: startTime,
      });
    }
  } else {
    if (endsOnSameDay) {
      return messages.singleDay({
        date: formatter.dateTime(start, { day: 'numeric', month: 'long' }),
        end: endTime,
        start: startTime,
      });
    } else {
      if (endsOnToday) {
        return messages.multiDayEndsToday({
          end: endTime,
          start: startTime,
          startDate: formatter.dateTime(start, {
            day: 'numeric',
            month: 'long',
          }),
        });
      } else {
        return messages.multiDay({
          end: endTime,
          endDate: formatter.dateTime(end, { day: 'numeric', month: 'long' }),
          start: startTime,
          startDate: formatter.dateTime(start, {
            day: 'numeric',
            month: 'long',
          }),
        });
      }
    }
  }
}
