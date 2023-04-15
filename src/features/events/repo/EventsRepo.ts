import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import shouldLoad from 'core/caching/shouldLoad';
import { Store } from 'core/store';
import {
  eventLoad,
  eventLoaded,
  eventsLoad,
  eventsLoaded,
  eventUpdate,
  eventUpdated,
  locationAdded,
  locationsLoad,
  locationsLoaded,
  participantAdded,
  participantsLoad,
  participantsLoaded,
  participantsReminded,
  respondentsLoad,
  respondentsLoaded,
} from '../store';
import { IFuture, PromiseFuture, RemoteItemFuture } from 'core/caching/futures';
import {
  ZetkinEvent,
  ZetkinEventParticipant,
  ZetkinEventResponse,
  ZetkinLocation,
} from 'utils/types/zetkin';

export type ZetkinEventPatchBody = Partial<
  Omit<
    ZetkinEvent,
    'id' | 'activity' | 'campaign' | 'location' | 'organization'
  >
> & {
  activity_id?: number;
  campaign_id?: number;
  location_id?: number;
  organization_id?: number;
};

export default class EventsRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  async addLocation(orgId: number, newLocation: Partial<ZetkinLocation>) {
    const location = await this._apiClient.post<ZetkinLocation>(
      `/api/orgs/${orgId}/locations`,
      {
        info_text: newLocation.info_text,
        lat: newLocation.lat,
        lng: newLocation.lng,
        title: newLocation.title,
      }
    );
    this._store.dispatch(locationAdded(location));
  }

  async addParticipant(orgId: number, eventId: number, personId: number) {
    const participant = await this._apiClient.put<ZetkinEventParticipant>(
      `/api/orgs/${orgId}/actions/${eventId}/participants/${personId}`,
      {
        id: personId,
        reminder_sent: null,
      }
    );
    this._store.dispatch(participantAdded([eventId, participant]));
  }

  constructor(env: Environment) {
    this._store = env.store;
    this._apiClient = env.apiClient;
  }

  getAllEvents(orgId: number): IFuture<ZetkinEvent[]> {
    const state = this._store.getState();

    return loadListIfNecessary(state.events.eventList, this._store, {
      actionOnLoad: () => eventsLoad(),
      actionOnSuccess: (events) => eventsLoaded(events),
      loader: () =>
        this._apiClient.get<ZetkinEvent[]>(`/api/orgs/${orgId}/actions`),
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

  getEventParticipants(
    orgId: number,
    eventId: number
  ): IFuture<ZetkinEventParticipant[]> {
    const state = this._store.getState();
    const list = state.events.participantsByEventId[eventId];

    return loadListIfNecessary(list, this._store, {
      actionOnLoad: () => participantsLoad(eventId),
      actionOnSuccess: (participants) =>
        participantsLoaded([eventId, participants]),
      loader: () =>
        this._apiClient.get<ZetkinEventParticipant[]>(
          `/api/orgs/${orgId}/actions/${eventId}/participants`
        ),
    });
  }

  getEventRespondents(
    orgId: number,
    eventId: number
  ): IFuture<ZetkinEventResponse[]> {
    const state = this._store.getState();
    const list = state.events.respondentsByEventId[eventId];

    return loadListIfNecessary(list, this._store, {
      actionOnLoad: () => respondentsLoad(eventId),
      actionOnSuccess: (respondents) =>
        respondentsLoaded([eventId, respondents]),
      loader: () =>
        this._apiClient.get<ZetkinEventResponse[]>(
          `/api/orgs/${orgId}/actions/${eventId}/responses`
        ),
    });
  }

  getLocations(orgId: number): IFuture<ZetkinLocation[]> {
    const state = this._store.getState();
    const locationsList = state.events.locationList;

    return loadListIfNecessary(locationsList, this._store, {
      actionOnLoad: () => locationsLoad(),
      actionOnSuccess: (data) => locationsLoaded(data),
      loader: () =>
        this._apiClient.get<ZetkinLocation[]>(`/api/orgs/${orgId}/locations`),
    });
  }

  async sendReminders(orgId: number, eventId: number) {
    await this._apiClient.post(
      `/api/orgs/${orgId}/actions/${eventId}/reminders`,
      {}
    );
    this._store.dispatch(participantsReminded(eventId));
  }

  updateEvent(orgId: number, eventId: number, data: ZetkinEventPatchBody) {
    this._store.dispatch(eventUpdate([eventId, Object.keys(data)]));
    this._apiClient
      .patch<ZetkinEvent>(`/api/orgs/${orgId}/actions/${eventId}`, data)
      .then((event) => {
        this._store.dispatch(eventUpdated(event));
      });
  }
}
