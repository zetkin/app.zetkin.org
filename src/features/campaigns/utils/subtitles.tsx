import dayjs from 'dayjs';
import validator from 'validator';

import messageIds from '../l10n/messageIds';
import { Msg } from '../../../core/i18n';
import ZUIRelativeTime from '../../../zui/ZUIRelativeTime';
import { isSameDate } from '../../../utils/dateUtils';
import isAfter = validator.isAfter;

export function getEmailSubtitle(published: string | null) {
  if (published === null) {
    return undefined;
  }
  const now = new Date();
  const publishedDate = dayjs(published);
  const id = publishedDate.isBefore(now)
    ? messageIds.activitiesOverview.subtitles.sentEarlier
    : messageIds.activitiesOverview.subtitles.sentLater;
  return (
    <Msg
      id={id}
      values={{
        relative: <ZUIRelativeTime datetime={publishedDate.toISOString()} />,
      }}
    />
  );
}

export function getEndsLabel(endDate: Date) {
  const now = new Date();
  if (endDate && isSameDate(endDate, now)) {
    return <Msg id={messageIds.activitiesOverview.subtitles.endsToday} />;
  } else if (endDate && endDate > now) {
    return (
      <Msg
        id={messageIds.activitiesOverview.subtitles.endsLater}
        values={{
          relative: <ZUIRelativeTime datetime={endDate.toISOString()} />,
        }}
      />
    );
  }

  return null;
}

export function getStartsLabel(startDate: Date) {
  const now = new Date();
  if (startDate && isSameDate(startDate, now)) {
    return <Msg id={messageIds.activitiesOverview.subtitles.startsToday} />;
  } else if (startDate && startDate > now) {
    return (
      <Msg
        id={messageIds.activitiesOverview.subtitles.startsLater}
        values={{
          relative: <ZUIRelativeTime datetime={startDate.toISOString()} />,
        }}
      />
    );
  }

  return null;
}

export function getSubtitles(
  subtitle: JSX.Element | undefined,
  startDate?: string | null,
  endDate?: string | null
) {
  const now = new Date().toString();
  if (subtitle) {
    return subtitle;
  }

  if (startDate && isAfter(startDate, now)) {
    return getStartsLabel(new Date(startDate));
  }
  if (endDate && isAfter(endDate, now)) {
    return getEndsLabel(new Date(endDate));
  }
}
