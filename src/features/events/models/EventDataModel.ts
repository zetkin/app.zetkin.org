import Environment from 'core/env/Environment';
import getEventState from '../utils/getEventState';
import getEventUrl from '../utils/getEventUrl';
import { ModelBase } from 'core/models';
import theme from 'theme';
import EventsRepo, {
  ZetkinEventPatchBody,
  ZetkinEventPostBody,
} from '../repo/EventsRepo';
import { IFuture, PromiseFuture } from 'core/caching/futures';
import {
  ZetkinEvent,
  ZetkinEventParticipant,
  ZetkinEventResponse,
  ZetkinLocation,
} from 'utils/types/zetkin';

export enum EventState {
  CANCELLED = 'cancelled',
  DRAFT = 'draft',
  ENDED = 'ended',
  OPEN = 'open',
  SCHEDULED = 'scheduled',
  UNKNOWN = 'unknown',
}

export default class EventDataModel extends ModelBase {
  private _env: Environment;
  private _eventId: number;
  private _orgId: number;
  private _repo: EventsRepo;

  addParticipant(personId: number) {
    this._repo.addParticipant(this._orgId, this._eventId, personId);
  }

  attendedParticipant(personId: number) {
    this._repo.updateParticipant(this._orgId, this._eventId, personId, {
      status: 'attended',
    });
  }

  cancel() {
    this._repo.updateEvent(this._orgId, this._eventId, {
      cancelled: new Date().toISOString(),
    });
  }

  cancelParticipant(personId: number): IFuture<ZetkinEventParticipant> {
    const promise = this._repo.updateParticipant(
      this._orgId,
      this._eventId,
      personId,
      {
        status: 'cancelled',
      }
    );
    return new PromiseFuture(promise);
  }

  constructor(env: Environment, orgId: number, eventId: number) {
    super();
    this._env = env;
    this._orgId = orgId;
    this._eventId = eventId;
    this._repo = new EventsRepo(env);
  }

  createEvent(eventBody: ZetkinEventPostBody): IFuture<ZetkinEvent> {
    const promise = this._repo
      .createEvent(eventBody, this._orgId)
      .then((event: ZetkinEvent) => {
        this._env.router.push(getEventUrl(event));
        return event;
      });
    return new PromiseFuture(promise);
  }

  deleteEvent() {
    this._repo.deleteEvent(this._orgId, this._eventId);
  }

  duplicateEvent() {
    const promise = this.createEvent(this.getDuplicatePostBody());
    return promise;
  }

  getBookedParticipants() {
    const participants = this.getParticipants().data;
    return participants?.filter((p) => p.cancelled == null) ?? [];
  }

  getCancelledParticipants() {
    const participants = this.getParticipants().data;
    return participants?.filter((p) => p.cancelled != null) ?? [];
  }

  getData(): IFuture<ZetkinEvent> {
    return this._repo.getEvent(this._orgId, this._eventId);
  }

  getDuplicatePostBody(): ZetkinEventPostBody {
    const currentEvent = this.getData();
    const duplicateEventPostBody: ZetkinEventPostBody = {
      activity_id: currentEvent.data?.activity?.id,
      end_time: currentEvent.data?.end_time,
      info_text: currentEvent.data?.info_text,
      location_id: currentEvent.data?.location?.id,
      num_participants_required: currentEvent.data?.num_participants_required,
      organization_id: currentEvent.data?.organization.id,
      start_time: currentEvent.data?.start_time,
      title: currentEvent.data?.title,
    };
    if (currentEvent.data?.campaign) {
      duplicateEventPostBody.campaign_id = currentEvent.data?.campaign.id;
    }
    // TODO: should this include URL?
    return duplicateEventPostBody;
  }

  getNumAvailParticipants(): number {
    const participants = this.getParticipants().data;
    return participants
      ? participants.filter((p) => p.cancelled == null).length
      : 0;
  }

  getNumCancelledParticipants(): number {
    const participants = this.getParticipants().data;
    return participants?.filter((p) => p.cancelled != null).length ?? 0;
  }

  getNumConfirmedParticipants(): number {
    const participants = this.getParticipants().data;
    return participants
      ? participants.filter((p) => p.attended != null).length
      : 0;
  }

  getNumNoshowParticipants(): number {
    const participants = this.getParticipants().data;
    return participants
      ? participants.filter((p) => p.noshow != null).length
      : 0;
  }

  getNumRemindedParticipants(): number {
    const participants = this.getParticipants().data;
    return (
      participants?.filter(
        (p) => p.reminder_sent != null && p.cancelled == null
      ).length ?? 0
    );
  }

  getNumSignedParticipants(): number {
    const participants = this.getParticipants().data;
    const respondents = this.getRespondents().data;
    return (
      respondents?.filter((r) => !participants?.some((p) => p.id === r.id))
        .length ?? 0
    );
  }

  getParticipantStatus = () => {
    const availParticipants = this.getNumAvailParticipants();
    const reqParticipants = this.getData().data?.num_participants_required ?? 0;
    const diff = reqParticipants - availParticipants;

    if (diff <= 0) {
      return theme.palette.statusColors.green;
    } else if (diff === 1) {
      return theme.palette.statusColors.orange;
    } else {
      return theme.palette.statusColors.red;
    }
  };

  getParticipants(): IFuture<ZetkinEventParticipant[]> {
    return this._repo.getEventParticipants(this._orgId, this._eventId);
  }

  getPendingSignUps(): ZetkinEventResponse[] {
    const participants = this.getParticipants().data;
    const respondents = this.getRespondents().data;

    return (
      respondents?.filter((r) => !participants?.some((p) => p.id === r.id)) ||
      []
    );
  }

  getRespondents(): IFuture<ZetkinEventResponse[]> {
    return this._repo.getEventRespondents(this._orgId, this._eventId);
  }

  noShowParticipant(personId: number) {
    this._repo.updateParticipant(this._orgId, this._eventId, personId, {
      status: 'noshow',
    });
  }

  publish() {
    this._repo.updateEvent(this._orgId, this._eventId, {
      published: new Date().toISOString(),
    });
  }

  reBookParticipant(personId: number) {
    this._repo.updateParticipant(this._orgId, this._eventId, personId, {
      status: null,
    });
  }

  removeContact() {
    this._repo.updateEvent(this._orgId, this._eventId, {
      contact_id: null,
    });
  }

  restoreEvent() {
    this._repo.updateEvent(this._orgId, this._eventId, {
      cancelled: null,
    });
  }

  sendReminders() {
    this._repo.sendReminders(this._orgId, this._eventId);
  }

  async setContact(contactId: number) {
    const eventParticipantsList = this.getParticipants().data;
    if (!eventParticipantsList?.find((item) => item.id == contactId)) {
      await this._repo.addParticipant(this._orgId, this._eventId, contactId);
    }
    this._repo.updateEvent(this._orgId, this._eventId, {
      contact_id: contactId,
    });
  }

  setLocation(location: ZetkinLocation) {
    this._repo.updateEvent(this._orgId, this._eventId, {
      location_id: location.id,
    });
  }

  setPublished(published: string | null) {
    this._repo.updateEvent(this._orgId, this._eventId, {
      cancelled: null,
      published: published ? new Date(published).toISOString() : null,
    });
  }

  setReqParticipants(reqParticipants: number) {
    this._repo.updateEvent(this._orgId, this._eventId, {
      num_participants_required: reqParticipants,
    });
  }

  setTitle(title: string) {
    this._repo.updateEvent(this._orgId, this._eventId, { title });
  }

  setType(id: number | null) {
    this._repo.updateEvent(this._orgId, this._eventId, {
      activity_id: id,
    });
  }

  get state(): EventState {
    const { data } = this.getData();
    if (!data) {
      return EventState.UNKNOWN;
    }

    return getEventState(data);
  }

  updateEventData(eventData: ZetkinEventPatchBody) {
    this._repo.updateEvent(this._orgId, this._eventId, eventData);
  }
}
