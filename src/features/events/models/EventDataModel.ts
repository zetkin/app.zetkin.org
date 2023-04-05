import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import EventsRepo, { ZetkinEventPatchBody } from '../repo/EventsRepo';
import { ZetkinEvent, ZetkinLocation } from 'utils/types/zetkin';

export enum EventState {
  CANCELLED = 'cancelled',
  DRAFT = 'draft',
  ENDED = 'ended',
  OPEN = 'open',
  SCHEDULED = 'scheduled',
  UNKNOWN = 'unknown',
}

export default class EventDataModel extends ModelBase {
  private _eventId: number;
  private _orgId: number;
  private _repo: EventsRepo;

  constructor(env: Environment, orgId: number, eventId: number) {
    super();
    this._orgId = orgId;
    this._eventId = eventId;
    this._repo = new EventsRepo(env);
  }

  getData(): IFuture<ZetkinEvent> {
    return this._repo.getEvent(this._orgId, this._eventId);
  }

  setLocation(location: ZetkinLocation) {
    this._repo.updateEvent(this._orgId, this._eventId, {
      location_id: location.id,
    });
  }

  setTitle(title: string) {
    this._repo.updateEvent(this._orgId, this._eventId, { title });
  }

  get state(): EventState {
    const { data } = this.getData();
    if (!data) {
      return EventState.UNKNOWN;
    }

    if (data.start_time) {
      const startTime = new Date(data.start_time);
      const now = new Date();

      if (startTime > now) {
        return EventState.SCHEDULED;
      } else {
        if (data.end_time) {
          const endTime = new Date(data.end_time);

          if (endTime < now) {
            return EventState.ENDED;
          }
        }

        return EventState.OPEN;
      }
    } else {
      return EventState.DRAFT;
    }
  }

  updateEventData(eventData: ZetkinEventPatchBody) {
    this._repo.updateEvent(this._orgId, this._eventId, eventData);
  }
}
