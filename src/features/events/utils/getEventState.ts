import { EventState } from '../models/EventDataModel';
import { ZetkinEvent } from 'utils/types/zetkin';

export default function getEventState(event: ZetkinEvent): EventState {
  if (!event.published && event.cancelled) {
    return EventState.CANCELLED;
  }
  const now = new Date();
  if (event.published) {
    const published = new Date(event.published);
    if (event.cancelled) {
      const cancelled = new Date(event.cancelled);
      if (cancelled > published) {
        return EventState.CANCELLED;
      }
    }
    if (event.end_time) {
      const endTime = new Date(event.end_time);
      if (endTime < now) {
        return EventState.ENDED;
      }
    }
    if (published > now) {
      return EventState.SCHEDULED;
    }
    return EventState.OPEN;
  } else {
    return EventState.DRAFT;
  }
}
