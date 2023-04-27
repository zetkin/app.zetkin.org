import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import theme from 'theme';
import EventsRepo, { ZetkinEventPatchBody } from '../repo/EventsRepo';
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
  private _eventId: number;
  private _orgId: number;
  private _repo: EventsRepo;

  addParticipant(personId: number) {
    this._repo.addParticipant(this._orgId, this._eventId, personId);
  }

  constructor(env: Environment, orgId: number, eventId: number) {
    super();
    this._orgId = orgId;
    this._eventId = eventId;
    this._repo = new EventsRepo(env);
  }

  getAvailParticipants(): number {
    const participants = this.getParticipants().data;
    return participants ? participants.length : 0;
  }

  getData(): IFuture<ZetkinEvent> {
    return this._repo.getEvent(this._orgId, this._eventId);
  }

  getParticipantStatus = () => {
    const availParticipants = this.getAvailParticipants();
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

  getRemindedParticipants(): number {
    const participants = this.getParticipants().data;
    return participants?.filter((p) => p.reminder_sent != null).length ?? 0;
  }

  getRespondents(): IFuture<ZetkinEventResponse[]> {
    return this._repo.getEventRespondents(this._orgId, this._eventId);
  }

  getSignedParticipants(): number {
    const participants = this.getParticipants().data;
    const respondents = this.getRespondents().data;
    return (
      respondents?.filter((r) => !participants?.some((p) => p.id === r.id))
        .length ?? 0
    );
  }

  sendReminders() {
    this._repo.sendReminders(this._orgId, this._eventId);
  }

  setLocation(location: ZetkinLocation) {
    this._repo.updateEvent(this._orgId, this._eventId, {
      location_id: location.id,
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

  setType(id: number) {
    this._repo.updateEvent(this._orgId, this._eventId, {
      activity_id: id,
    });
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
