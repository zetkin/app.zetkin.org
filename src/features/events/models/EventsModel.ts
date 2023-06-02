import Environment from 'core/env/Environment';
import EventsRepo from '../repo/EventsRepo';
import { ModelBase } from 'core/models';
import { ZetkinEvent } from 'utils/types/zetkin';
import { dateIsAfter, dateIsBefore, isSameDate } from 'utils/dateUtils';
import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';

export class EventsModel extends ModelBase {
  private _orgId: number;
  private _repo: EventsRepo;

  constructor(env: Environment, orgId: number) {
    super();
    this._orgId = orgId;
    this._repo = new EventsRepo(env);
  }

  deleteEvents(events: number[]) {
    this._repo.deleteEvents(this._orgId, events);
  }

  getAllEvents(): IFuture<ZetkinEvent[]> {
    return this._repo.getAllEvents(this._orgId);
  }

  getParallelEvents(
    startString: string,
    endString: string
  ): IFuture<ZetkinEvent[]> {
    const allEvents = this.getAllEvents();

    if (allEvents.isLoading) {
      return new LoadingFuture();
    } else if (allEvents.error) {
      return new ErrorFuture(allEvents.error);
    }

    const start = new Date(startString);
    const end = new Date(endString);

    const filteredEvents = allEvents?.data?.filter((event) => {
      const eventStart = new Date(event.start_time);
      const eventEnd = new Date(event.end_time);

      return (
        isSameDate(start, eventStart) ||
        (dateIsBefore(start, eventStart) && dateIsAfter(start, eventEnd)) ||
        (dateIsAfter(start, eventStart) && dateIsBefore(end, eventStart))
      );
    });

    return new ResolvedFuture(filteredEvents || []);
  }

  getRelatedEvents(currentEvent: ZetkinEvent): IFuture<ZetkinEvent[]> {
    const relatedEvents: ZetkinEvent[] = [];
    const allEvents = this.getAllEvents();

    if (allEvents.isLoading) {
      return new LoadingFuture();
    } else if (allEvents.error) {
      return new ErrorFuture(allEvents.error);
    }

    if (!allEvents.data) {
      return new ResolvedFuture(relatedEvents);
    }
    for (const event of allEvents.data) {
      if (event.id !== currentEvent.id) {
        //check if it's same start date or same end date and same location and activity
        if (
          currentEvent.start_time == event.end_time ||
          currentEvent.end_time == event.start_time
        ) {
          if (
            event.activity?.id == currentEvent.activity?.id &&
            event.location?.id == currentEvent.location?.id
          ) {
            relatedEvents.push(event);
          }
        }

        //check if event is exactly in parallel with same event type
        if (
          currentEvent.start_time == event.start_time &&
          currentEvent.end_time == event.end_time &&
          event.activity?.id == currentEvent.activity?.id
        ) {
          relatedEvents.push(event);
        }
      }
    }
    return new ResolvedFuture(relatedEvents || []);
  }

  updateEvents(events: number[], published: boolean, cancelled: boolean) {
    this._repo.updateEvents(this._orgId, events, {
      cancelled: cancelled ? new Date().toISOString() : null,
      published: published ? new Date().toISOString() : null,
    });
  }
}
