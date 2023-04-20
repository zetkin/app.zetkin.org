import Environment from 'core/env/Environment';
import EventsRepo from '../repo/EventsRepo';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import { ZetkinLocation } from 'utils/types/zetkin';

export default class LocationsModel extends ModelBase {
  private _orgId: number;
  private _repo: EventsRepo;

  addLocation(newLocation: Partial<ZetkinLocation>): void {
    this._repo.addLocation(this._orgId, newLocation);
  }

  constructor(env: Environment, orgId: number) {
    super();
    this._orgId = orgId;
    this._repo = new EventsRepo(env);
  }

  getLocations(): IFuture<ZetkinLocation[]> {
    return this._repo.getLocations(this._orgId);
  }

  setLocationDescription(locationId: number, description: string) {
    this._repo.updateLocation(this._orgId, locationId, {
      info_text: description,
    });
  }

  setLocationTitle(locationId: number, title: string) {
    this._repo.updateLocation(this._orgId, locationId, { title });
  }
}
