import dayjs, { Dayjs } from 'dayjs';

import { ZetkinEvent, ZetkinOrganization } from 'utils/types/zetkin';

const timeStamp = (t: Dayjs): string => t.format('YYYYMMDDTHHmmss');
const formatString = (str: string): string =>
  str
    .replaceAll('\n', '\\n')
    .match(/.{1,74}/g)
    ?.join('\r\n\t') ?? '';

export default function icsFromEvents(
  name: string,
  events: ZetkinEvent[],
  org: ZetkinOrganization
): string {
  const vLines: string[] = ['NAME:' + name, 'X-WR-CALNAME:' + name];
  events
    .filter((event) => !event.cancelled && event.published)
    .forEach((event) => {
      vLines.push(`BEGIN:VEVENT`);
      vLines.push(`UID:${event.id}@${process.env.ZETKIN_APP_HOST}`);
      vLines.push(
        `ORGANIZER;CN=${event.organization.title.replace('\n', ' ')}:MAILTO:${
          org.email ?? 'noreply@zetkin.org'
        }`
      );
      vLines.push(`DTSTAMP:${timeStamp(dayjs(event.published))}`);
      vLines.push(`DTSTART:${timeStamp(dayjs(event.start_time))}`);
      vLines.push(`DTEND:${timeStamp(dayjs(event.end_time))}`);
      if (event.title) {
        vLines.push(`SUMMARY:${event.title || event.activity?.title || ''}`);
      }
      if (event.info_text) {
        vLines.push(`DESCRIPTION:${event.info_text ?? ''}`);
      }
      vLines.push(
        `URL:${process.env.ZETKIN_APP_HOST}/o/${org.id}/events/${event.id}`
      );
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
