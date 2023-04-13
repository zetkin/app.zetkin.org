import Environment from 'core/env/Environment';
import EventsRepo from '../repo/EventsRepo';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import { ZetkinActivity } from 'utils/types/zetkin';

export default class EventTypesModel extends ModelBase {
  private _eventId: number;
  private _orgId: number;
  private _repo: EventsRepo;

  addType(activity_id: number, title: string) {
    this._repo.addType(this._orgId, { activity_id, title });
  }
  constructor(env: Environment, orgId: number, eventId: number) {
    super();
    this._eventId = eventId;
    this._orgId = orgId;
    this._repo = new EventsRepo(env);
  }

  getTypes(): IFuture<ZetkinActivity[]> {
    return this._repo.getAllTypes(this._orgId);
  }

  setType(id: number) {
    this._repo.updateEventType(this._orgId, this._eventId, {
      activity_id: id,
    });
  }
}
