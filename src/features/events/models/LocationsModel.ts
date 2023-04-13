import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import { ZetkinLocation } from 'utils/types/zetkin';
import EventsRepo, { ZetkinLocationPatchBody } from '../repo/EventsRepo';

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

  updateLocationData(locationId: number, data: ZetkinLocationPatchBody) {
    this._repo.updateLocation(this._orgId, locationId, { ...data });
  }
}
