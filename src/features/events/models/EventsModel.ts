import Environment from 'core/env/Environment';
import EventsRepo from '../repo/EventsRepo';
import { ModelBase } from 'core/models';
import { ZetkinEvent } from 'utils/types/zetkin';
import { dateIsBefore, isBefore, isSameDate } from 'utils/dateUtils';
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

  getAllEvents(): IFuture<ZetkinEvent[]> {
    return this._repo.getAllEvents(this._orgId);
  }

  getEventsInTimespan(
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
        (isBefore(start, eventStart) && dateIsBefore(start, eventEnd)) ||
        (dateIsBefore(start, eventStart) && isBefore(end, eventStart))
      );
    });

    return new ResolvedFuture(filteredEvents || []);
  }
}
