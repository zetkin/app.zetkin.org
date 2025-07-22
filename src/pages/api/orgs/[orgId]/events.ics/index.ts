import dayjs, { Dayjs } from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinEvent } from 'utils/types/zetkin';

const timeStamp = (t: Dayjs) => t.format('YYYYMMDDTHHmmss');

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { orgId } = req.query;

  const apiClient = new BackendApiClient(req.headers);

  const startTime = dayjs()
    .subtract(1, 'month')
    .toDate()
    .toISOString()
    .slice(0, 10);

  const events = await apiClient.get<ZetkinEvent[]>(
    `/api/orgs/${orgId}/actions?filter=start_time>${startTime}`
  );

  const vEvents = events
    .filter((event) => !event.cancelled && event.published)
    .map((event) => {
      let str = `BEGIN:VEVENT
UID:${event.id}@zetkin.org
ORGANIZER;CN=${event.organization.title.replace(
        '\n',
        ' '
      )}:MAILTO:noreply@zetkin.org
DTSTAMP:${timeStamp(dayjs(event.published))}
DTSTART:${timeStamp(dayjs(event.start_time))}
DTEND:${timeStamp(dayjs(event.end_time))}
SUMMARY:${event.title?.replace('\n', ' ') ?? ''}
`;
      if (event.location) {
        str += `GEO:${event.location.lat};${event.location.lng}\n`;
        str += `LOCATION:${event.location.title}\n`;
      }
      str += 'END:VEVENT';

      return str;
    });

  res
    .setHeader('Content-Type', 'text/calendar')
    .setHeader(
      'Cache-Control',
      'public, s-maxage=10, stale-while-revalidate=59'
    )
    .status(200).send(`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Zetkin Foundation//Zetkin App//EN
${vEvents.join('\n')}
END:VCALENDAR`);
}
