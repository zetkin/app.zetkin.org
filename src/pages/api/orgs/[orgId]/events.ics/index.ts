import dayjs, { Dayjs } from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinEvent, ZetkinOrganization } from 'utils/types/zetkin';

const timeStamp = (t: Dayjs): string => t.format('YYYYMMDDTHHmmss');
const formatString = (str: string): string =>
  str
    .replaceAll('\n', '\\n')
    .match(/.{1,74}/g)
    ?.join('\r\n\t') ?? '';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { orgId } = req.query;

  const apiClient = new BackendApiClient(req.headers);

  const startTime = dayjs()
    .subtract(2, 'month')
    .toDate()
    .toISOString()
    .slice(0, 10);

  const events = await apiClient.get<ZetkinEvent[]>(
    `/api/orgs/${orgId}/actions?frecursive&ilter=start_time>=${startTime}`
  );

  const org = await apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`);

  const vEvents: string[] = [];
  events
    .filter((event) => !event.cancelled && event.published)
    .forEach((event) => {
      vEvents.push(`BEGIN:VEVENT`);
      vEvents.push(`UID:${event.id}@${process.env.ZETKIN_APP_HOST}`);
      vEvents.push(
        `ORGANIZER;CN=${event.organization.title.replace('\n', ' ')}:MAILTO:${
          org.email ?? 'noreply@zetkin.org'
        }`
      );
      vEvents.push(`DTSTAMP:${timeStamp(dayjs(event.published))}`);
      vEvents.push(`DTSTART:${timeStamp(dayjs(event.start_time))}`);
      vEvents.push(`DTEND:${timeStamp(dayjs(event.end_time))}`);
      vEvents.push(`SUMMARY:${event.title ?? ''}`);
      vEvents.push(`DESCRIPTION:${event.info_text ?? ''}`);
      vEvents.push(
        `URL:${process.env.ZETKIN_APP_HOST}/o/${orgId}/events/${event.id}`
      );
      if (event.location) {
        vEvents.push(`GEO:${event.location.lat};${event.location.lng}`);
        vEvents.push(`LOCATION:${event.location.title}`);
      }

      if (event.cover_file?.url) {
        vEvents.push(
          `IMAGE;VALUE=URI;DISPLAY=BADGE;FMTTYPE=${event.cover_file.mime_type}:${event.cover_file.url}`
        );
      }

      vEvents.push('END:VEVENT');
    });

  const eventsStr = vEvents.map((s) => formatString(s)).join('\r\n');

  res.setHeader('Content-Type', 'text/calendar').status(200)
    .send(`BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:-//Zetkin Foundation//Zetkin App//EN\r
${eventsStr}\r
END:VCALENDAR`);
}
