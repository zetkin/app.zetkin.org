import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import shouldLoad from 'core/caching/shouldLoad';
import { Store } from 'core/store';
import {
  eventLoad,
  eventLoaded,
  eventTypeAdd,
  eventTypeAdded,
  eventTypesLoad,
  eventTypesLoaded,
  eventUpdate,
  eventUpdated,
} from '../store';
import { IFuture, PromiseFuture, RemoteItemFuture } from 'core/caching/futures';
import {
  ZetkinActivity,
  ZetkinActivityPostBody,
  ZetkinEvent,
} from 'utils/types/zetkin';

export default class EventsRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  addType(orgId: number, data: ZetkinActivityPostBody) {
    this._store.dispatch(eventTypeAdd([orgId, data]));
    this._apiClient
      .post<ZetkinActivity>(`/api/orgs/${orgId}/activities`, data)
      .then((event) => {
        this._store.dispatch(eventTypeAdded(event));
      });
  }
  constructor(env: Environment) {
    this._store = env.store;
    this._apiClient = env.apiClient;
  }

  getAllTypes(orgId: number) {
    const state = this._store.getState();
    return loadListIfNecessary(state.events.eventTypeList, this._store, {
      actionOnLoad: () => eventTypesLoad(orgId),
      actionOnSuccess: (data) => eventTypesLoaded([orgId, data]),
      loader: () =>
        this._apiClient.get<ZetkinActivity[]>(`/api/orgs/${orgId}/activities`),
    });
  }

  getEvent(orgId: number, id: number): IFuture<ZetkinEvent> {
    const state = this._store.getState();
    const item = state.events.eventList.items.find((item) => item.id == id);

    if (!item || shouldLoad(item)) {
      this._store.dispatch(eventLoad(id));
      const promise = this._apiClient
        .get<ZetkinEvent>(`/api/orgs/${orgId}/actions/${id}`)
        .then((event) => {
          this._store.dispatch(eventLoaded(event));
          return event;
        });
      return new PromiseFuture(promise);
    } else {
      return new RemoteItemFuture(item);
    }
  }

  updateEvent(
    orgId: number,
    eventId: number,
    data: Partial<Omit<ZetkinEvent, 'id'>>
  ) {
    this._store.dispatch(eventUpdate([eventId, Object.keys(data)]));
    this._apiClient
      .patch<ZetkinEvent>(`/api/orgs/${orgId}/actions/${eventId}`, data)
      .then((event) => {
        this._store.dispatch(eventUpdated(event));
      });
  }
}
