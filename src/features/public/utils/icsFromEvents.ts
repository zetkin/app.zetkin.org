'use server';

import dayjs, { Dayjs } from 'dayjs';
import { createIntl, createIntlCache } from 'react-intl';

import { ZetkinEvent, ZetkinOrganization } from 'utils/types/zetkin';
import { getMessages } from 'utils/locale';
import messageIds from 'features/public/l10n/messageIds';
import { stringToBool } from 'utils/stringUtils';

// toISOString is used instead of format since we want the time without timezone
// Otherwise the timezone would be applied twice in the ICS file
const timeStamp = (t: Dayjs): string => {
  let str = t.toISOString();
  str = str.substring(0, str.lastIndexOf('.'));
  str = str.replaceAll(':', '');
  str = str.replaceAll('-', '');
  return str;
};

const formatString = (str: string): string =>
  str
    .replaceAll('\n', '\\n')
    .match(/.{1,74}/g)
    ?.join('\r\n\t') ?? '';

export default async function icsFromEvents(
  name: string,
  events: ZetkinEvent[],
  org: ZetkinOrganization,
  lang: string,
  timeZone?: string
): Promise<string> {
  const vLines: string[] = ['NAME:' + name, 'X-WR-CALNAME:' + name];

  const messages = await getMessages(lang, ['feat.home']);

  const joinEventCtaMsg =
    messages['ics.joinEvent'] || messageIds.ics.joinEvent._defaultMessage;

  const intlCache = createIntlCache();
  const intl = createIntl({ locale: lang }, intlCache);

  events
    .filter((event) => !event.cancelled && event.published)
    .forEach((event) => {
      const eventLink = `${stringToBool(process.env.ZETKIN_USE_TLS) ? 'https' : 'http'}://${process.env.ZETKIN_APP_HOST}/o/${org.id}/events/${event.id}`;

      const joinEventCta = intl.formatMessage(
        {
          defaultMessage: joinEventCtaMsg,
          id: 'feat.home.ics.joinEvent',
        },
        {
          eventLink,
        }
      );

      vLines.push(`BEGIN:VEVENT`);
      vLines.push(`UID:${event.id}@${process.env.ZETKIN_APP_HOST}`);
      vLines.push(
        `ORGANIZER;CN=${event.organization.title.replace('\n', ' ')}:MAILTO:${
          org.email ?? 'noreply@zetkin.org'
        }`
      );
      const tz = timeZone !== undefined ? `;TZID=${timeZone}` : '';
      vLines.push(`DTSTAMP${tz}:${timeStamp(dayjs(event.published))}`);
      vLines.push(`DTSTART${tz}:${timeStamp(dayjs(event.start_time))}`);
      vLines.push(`DTEND${tz}:${timeStamp(dayjs(event.end_time))}`);
      if (event.title || event.activity?.title) {
        vLines.push(`SUMMARY:${event.title || event.activity?.title || ''}`);
      }
      vLines.push(
        `DESCRIPTION:${joinEventCta}${event.info_text ? '\n\n' + event.info_text : ''}`
      );
      vLines.push(`URL:${eventLink}`);
      if (event.location) {
        vLines.push(`GEO:${event.location.lat};${event.location.lng}`);
        vLines.push(`LOCATION:${event.location.title}`);
      }

      if (event.cover_file?.url) {
        vLines.push(
          `IMAGE;VALUE=URI;DISPLAY=BADGE;FMTTYPE=${event.cover_file.mime_type}:${event.cover_file.url}`
        );
      }

      vLines.push('END:VEVENT');
    });

  const eventsStr = vLines.map((s) => formatString(s)).join('\r\n');
  const body = `BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:-//Zetkin Foundation//Zetkin App//EN\r
${eventsStr}\r
END:VCALENDAR`;

  return body;
}
