import deleteEvents from '../rpc/deleteEvents';
import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import shouldLoad from 'core/caching/shouldLoad';
import { Store } from 'core/store';
import updateEvents from '../rpc/updateEvents';
import {
  eventCreate,
  eventCreated,
  eventDeleted,
  eventLoad,
  eventLoaded,
  eventsLoad,
  eventsLoaded,
  eventUpdate,
  eventUpdated,
  locationAdded,
  locationsLoad,
  locationsLoaded,
  locationUpdate,
  locationUpdated,
  participantAdded,
  participantsLoad,
  participantsLoaded,
  participantsReminded,
  participantUpdated,
  resetSelection,
  respondentsLoad,
  respondentsLoaded,
  typeAdd,
  typeAdded,
  typesLoad,
  typesLoaded,
} from '../store';
import { IFuture, PromiseFuture, RemoteItemFuture } from 'core/caching/futures';
import {
  ZetkinActivity,
  ZetkinEvent,
  ZetkinEventParticipant,
  ZetkinEventResponse,
  ZetkinEventTypePostBody,
  ZetkinLocation,
} from 'utils/types/zetkin';

export type ZetkinEventPatchBody = Partial<
  Omit<
    ZetkinEvent,
    'id' | 'activity' | 'campaign' | 'location' | 'organization'
  >
> & {
  activity_id?: number | null;
  campaign_id?: number;
  cancelled?: string | null;
  contact_id?: number | null;
  location_id?: number | null;
  organization_id?: number;
  published?: string | null;
};

export type ZetkinEventPostBody = ZetkinEventPatchBody;

export type ZetkinLocationPatchBody = Partial<Omit<ZetkinLocation, 'id'>>;

type ZetkinEventUpdateCancelledPublished = {
  cancelled: string | null;
  id: number;
  published: string | null;
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
      {}
    );
    this._store.dispatch(participantAdded([eventId, participant]));
  }

  addType(orgId: number, data: ZetkinEventTypePostBody) {
    this._store.dispatch(typeAdd([orgId, data]));
    this._apiClient
      .post<ZetkinActivity>(`/api/orgs/${orgId}/activities`, data)
      .then((event) => {
        this._store.dispatch(typeAdded(event));
      });
  }

  constructor(env: Environment) {
    this._store = env.store;
    this._apiClient = env.apiClient;
  }

  async createEvent(
    eventBody: ZetkinEventPostBody,
    orgId: number
  ): Promise<ZetkinEvent> {
    this._store.dispatch(eventCreate());
    const event = await this._apiClient.post<ZetkinEvent, ZetkinEventPostBody>(
      `/api/orgs/${orgId}/${
        eventBody.campaign_id ? `campaigns/${eventBody.campaign_id}/` : ''
      }actions`,
      eventBody
    );
    this._store.dispatch(eventCreated(event));
    return event;
  }

  async deleteEvent(orgId: number, eventId: number) {
    await this._apiClient.delete(`/api/orgs/${orgId}/actions/${eventId}`);
    this._store.dispatch(eventDeleted(eventId));
  }

  async deleteEvents(orgId: number, events: number[]) {
    const result = await this._apiClient.rpc(deleteEvents, {
      events,
      orgId,
    });

    result.removedEvents.forEach((event) => {
      this._store.dispatch(eventDeleted(event));
    });
    this._store.dispatch(resetSelection());
  }

  getAllEvents(orgId: number): IFuture<ZetkinEvent[]> {
    const state = this._store.getState();

    return loadListIfNecessary(state.events.eventList, this._store.dispatch, {
      actionOnLoad: () => eventsLoad(),
      actionOnSuccess: (events) => eventsLoaded(events),
      loader: () =>
        this._apiClient.get<ZetkinEvent[]>(`/api/orgs/${orgId}/actions`),
    });
  }

  getAllTypes(orgId: number) {
    const state = this._store.getState();
    return loadListIfNecessary(state.events.typeList, this._store.dispatch, {
      actionOnLoad: () => typesLoad(orgId),
      actionOnSuccess: (data) => typesLoaded([orgId, data]),
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

  getEventParticipants(
    orgId: number,
    eventId: number
  ): IFuture<ZetkinEventParticipant[]> {
    const state = this._store.getState();
    const list = state.events.participantsByEventId[eventId];

    return loadListIfNecessary(list, this._store.dispatch, {
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

    return loadListIfNecessary(list, this._store.dispatch, {
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

    return loadListIfNecessary(locationsList, this._store.dispatch, {
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

  async updateEvents(
    orgId: number,
    events: ZetkinEventUpdateCancelledPublished[]
  ) {
    const result = await this._apiClient.rpc(updateEvents, {
      events,
      orgId: orgId.toString(),
    });

    result.forEach((event) => {
      this._store.dispatch(eventUpdated(event));
    });
    this._store.dispatch(resetSelection());
  }

  updateLocation(
    orgId: number,
    locationId: number,
    data: ZetkinLocationPatchBody
  ) {
    this._store.dispatch(locationUpdate([locationId, Object.keys(data)]));
    this._apiClient
      .patch<ZetkinLocation>(`/api/orgs/${orgId}/locations/${locationId}`, data)
      .then((location) => {
        this._store.dispatch(locationUpdated(location));
      });
  }

  updateParticipant(
    orgId: number,
    eventId: number,
    personId: number,
    data: Partial<ZetkinEventParticipant>
  ) {
    return this._apiClient
      .put<ZetkinEventParticipant>(
        `/api/orgs/${orgId}/actions/${eventId}/participants/${personId}`,
        data
      )
      .then((participant) => {
        this._store.dispatch(participantUpdated([eventId, participant]));

        return participant;
      });
  }
}
