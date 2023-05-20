import { ZetkinEvent } from 'utils/types/zetkin';

export default function getEventUrl(event: ZetkinEvent | null) {
  if (event) {
    return `/organize/${event.organization.id}/projects/${
      event.campaign ? `${event.campaign?.id}` : 'standalone'
    }/events/${event.id}`;
  } else {
    return '';
  }
}
