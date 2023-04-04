import Environment from 'core/env/Environment';
import EventsRepo from '../repo/EventsRepo';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import { ZetkinEvent, ZetkinLocation } from 'utils/types/zetkin';

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
}
