import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ParticipantOp } from './types';
import {
  RemoteItem,
  remoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import {
  ZetkinActivity,
  ZetkinEvent,
  ZetkinEventParticipant,
  ZetkinEventResponse,
  ZetkinEventTypePostBody,
  ZetkinLocation,
} from 'utils/types/zetkin';

export enum ACTION_FILTER_OPTIONS {
  CONTACT_MISSING = 'missing',
  UNSENT_NOTIFICATIONS = 'unsent',
  SIGNUPS_PENDING = 'pending',
  UNDERBOOKED = 'underbooked',
  OVERBOOKED = 'overbooked',
}

export enum STATE_FILTER_OPTIONS {
  CANCELLED = 'cancelled',
  DRAFT = 'draft',
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
}

export type EventStats = {
  id: number;
  numBooked: number;
  numPending: number;
  numReminded: number;
  numSignups: number;
};

export type EventFilterOptions =
  | ACTION_FILTER_OPTIONS
  | STATE_FILTER_OPTIONS
  | string;

export type FilterCategoryType =
  | 'selectedActions'
  | 'selectedStates'
  | 'selectedTypes';

export interface EventsStoreSlice {
  eventList: RemoteList<ZetkinEvent>;
  eventsByCampaignId: Record<string, RemoteList<ZetkinEvent>>;
  eventsByDate: Record<string, RemoteList<ZetkinEvent>>;
  filters: {
    selectedActions: string[];
    selectedStates: string[];
    selectedTypes: string[];
    text: string;
  };
  locationList: RemoteList<ZetkinLocation>;
  pendingParticipantOps: ParticipantOp[];
  participantsByEventId: Record<number, RemoteList<ZetkinEventParticipant>>;
  remindingByEventId: Record<number, boolean>;
  respondentsByEventId: Record<number, RemoteList<ZetkinEventResponse>>;
  selectedEventIds: number[];
  statsByEventId: Record<number, RemoteItem<EventStats>>;
  typeList: RemoteList<ZetkinActivity>;
}

const initialState: EventsStoreSlice = {
  eventList: remoteList(),
  eventsByCampaignId: {},
  eventsByDate: {},
  filters: {
    selectedActions: [],
    selectedStates: [],
    selectedTypes: [],
    text: '',
  },
  locationList: remoteList(),
  participantsByEventId: {},
  pendingParticipantOps: [],
  remindingByEventId: {},
  respondentsByEventId: {},
  selectedEventIds: [],
  statsByEventId: {},
  typeList: remoteList(),
};

const eventsSlice = createSlice({
  initialState,
  name: 'events',
  reducers: {
    campaignEventsLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.eventsByCampaignId[id] = remoteList<ZetkinEvent>();
      state.eventsByCampaignId[id].isLoading = true;
    },
    campaignEventsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinEvent[]]>
    ) => {
      const [id, events] = action.payload;
      const timestamp = new Date().toISOString();
      addEventToState(state, events);
      state.eventsByCampaignId[id].isLoading = false;
      state.eventsByCampaignId[id].loaded = timestamp;
    },
    eventCreate: (state) => {
      state.eventList.isLoading = true;
    },
    eventCreated: (state, action: PayloadAction<ZetkinEvent>) => {
      const event = action.payload;
      state.eventList.isLoading = false;
      addEventToState(state, [event]);
    },
    eventDeleted: (state, action: PayloadAction<number>) => {
      const eventId = action.payload;
      const eventListItem = state.eventList.items.find(
        (item) => item.id === eventId
      );

      if (eventListItem) {
        eventListItem.deleted = true;
      }

      for (const date in state.eventsByDate) {
        const item = state.eventsByDate[date].items.find(
          (item) => item.id === eventId
        );

        if (item) {
          item.deleted = true;
        }
      }

      for (const campaignId in state.eventsByCampaignId) {
        const item = state.eventsByCampaignId[campaignId].items.find(
          (item) => item.id === eventId
        );

        if (item) {
          item.deleted = true;
        }
      }
    },
    eventLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.eventList.items.find((item) => item.id == id);
      state.eventList.items = state.eventList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    eventLoaded: (state, action: PayloadAction<ZetkinEvent>) => {
      const event = action.payload;
      const item = state.eventList.items.find((item) => item.id == event.id);

      if (!item) {
        throw new Error('Finished loading item that never started loading');
      }
      addEventToState(state, [event]);

      item.isLoading = false;
      item.loaded = new Date().toISOString();
    },
    eventRangeLoad: (state, action: PayloadAction<string[]>) => {
      const isoDateRange = action.payload;
      isoDateRange.forEach((isoDate) => {
        const dateStr = isoDate.slice(0, 10);
        if (!state.eventsByDate[dateStr]) {
          state.eventsByDate[dateStr] = remoteList();
        }
        state.eventsByDate[dateStr].isLoading = true;
      });
    },
    eventRangeLoaded: (
      state,
      action: PayloadAction<[ZetkinEvent[], string[]]>
    ) => {
      const [events, isoDateRange] = action.payload;
      addEventToState(state, events);

      isoDateRange.forEach((isoDate) => {
        const dateStr = isoDate.slice(0, 10);
        if (!state.eventsByDate[dateStr]) {
          state.eventsByDate[dateStr] = remoteList();
        }

        state.eventsByDate[dateStr].isLoading = false;
        state.eventsByDate[dateStr].loaded = new Date().toISOString();
      });
    },
    eventUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [eventId, mutating] = action.payload;
      const item = state.eventList.items.find((item) => item.id == eventId);
      if (item) {
        item.mutating = mutating;
      }
    },
    eventUpdated: (state, action: PayloadAction<ZetkinEvent>) => {
      const event = action.payload;
      addEventToState(state, [event]);
    },
    eventsCreate: (state) => {
      state.eventList.isLoading = true;
    },
    eventsCreated: (state, action: PayloadAction<ZetkinEvent[]>) => {
      const events = action.payload;
      addEventToState(state, events);
      state.eventList.isLoading = false;
    },
    eventsDeselected: (state, action: PayloadAction<ZetkinEvent[]>) => {
      const toggledEvents = action.payload;

      state.selectedEventIds = state.selectedEventIds.filter(
        (selectedEventId) =>
          !toggledEvents.some((event) => event.id == selectedEventId)
      );
    },
    eventsLoad: (state) => {
      state.eventList.isLoading = true;
    },
    eventsLoaded: (state, action: PayloadAction<ZetkinEvent[]>) => {
      addEventToState(state, action.payload);
      state.eventList.loaded = new Date().toISOString();
    },
    eventsSelected: (state, action: PayloadAction<ZetkinEvent[]>) => {
      const toggledEvents = action.payload;

      const uniqueEventIds = new Set([
        ...state.selectedEventIds,
        ...toggledEvents.map((filtered) => filtered.id),
      ]);
      state.selectedEventIds = Array.from(uniqueEventIds);
    },
    eventsUpdate: (state, action: PayloadAction<[number[], string[]]>) => {
      const [eventIds, mutating] = action.payload;
      const items = state.eventList.items.filter((item) =>
        eventIds.find((eventId) => item.id == eventId)
      );

      items.map((item) => {
        item.mutating = mutating;
        if (item.data) {
          const event = item.data;

          const dateStr = item.data.start_time.slice(0, 10);
          state.eventsByDate[dateStr].items.map((i) => {
            if (i.id === event.id) {
              i.mutating = mutating;
            }
          });

          if (event.campaign) {
            state.eventsByCampaignId[event.campaign.id].items.push(
              remoteItem(event.id, { data: event })
            );
          }
        }
      });
    },
    eventsUpdated: (state, action: PayloadAction<ZetkinEvent[]>) => {
      const updatedEvents = action.payload;
      const items = state.eventList.items.filter((item) =>
        updatedEvents.find((event) => item.id == event.id)
      );

      items.map((item) => {
        item.mutating = [];
        const oldEvent = item.data;
        const updatedEvent = updatedEvents.find(
          (event) => event.id === item.id
        );
        if (oldEvent && updatedEvent) {
          item.data = { ...item.data, ...updatedEvent };

          const oldDate = oldEvent.start_time.slice(0, 10);
          const newDate = updatedEvent.start_time.slice(0, 10);

          state.eventsByDate[newDate].items.push(
            remoteItem(updatedEvent.id, { data: updatedEvent })
          );

          state.eventsByDate[oldDate].items = state.eventsByDate[
            oldDate
          ].items.filter((event) => event.id !== updatedEvent.id);

          if (updatedEvent.campaign) {
            const eventItem = state.eventsByCampaignId[
              updatedEvent.campaign.id
            ].items.find((item) => item.id == updatedEvent.id);
            if (eventItem) {
              eventItem.data = { ...eventItem.data, ...updatedEvent };
              eventItem.mutating = [];
            }
          }
        }
      });
    },
    filterTextUpdated: (
      state,
      action: PayloadAction<{
        filterText: string;
      }>
    ) => {
      const { filterText } = action.payload;
      state.filters.text = filterText;
    },
    filterUpdated: (
      state,
      action: PayloadAction<{
        filterCategory: FilterCategoryType;
        selectedFilterValue: EventFilterOptions[];
      }>
    ) => {
      const { filterCategory, selectedFilterValue } = action.payload;
      state.filters[filterCategory] = selectedFilterValue;
    },
    locationAdded: (state, action: PayloadAction<ZetkinLocation>) => {
      const location = action.payload;
      state.locationList.items = state.locationList.items
        .filter((l) => l.id !== location.id)
        .concat([remoteItem(location.id, { data: location })]);
    },
    locationLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.locationList.items.find((item) => item.id == id);
      state.locationList.items = state.locationList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    locationLoaded: (state, action: PayloadAction<ZetkinLocation>) => {
      const event = action.payload;
      const item = state.locationList.items.find((item) => item.id == event.id);

      if (!item) {
        throw new Error('Finished loading item that never started loading');
      }

      item.data = event;
      item.isLoading = false;
      item.loaded = new Date().toISOString();
    },
    locationUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [locationId, mutating] = action.payload;
      const item = state.locationList.items.find(
        (location) => location.id === locationId
      );
      if (item) {
        item.mutating = mutating;
      }
    },
    locationUpdated: (state, action: PayloadAction<ZetkinLocation>) => {
      const location = action.payload;
      const item = state.locationList.items.find(
        (item) => item.id == location.id
      );
      if (item) {
        item.data = { ...item.data, ...location };
        item.mutating = [];
      }
    },
    locationsLoad: (state) => {
      state.locationList.isLoading = true;
    },
    locationsLoaded: (state, action: PayloadAction<ZetkinLocation[]>) => {
      const locations = action.payload;
      const timestamp = new Date().toISOString();
      state.locationList = remoteList(locations);
      state.locationList.loaded = timestamp;
    },
    participantAdded: (
      state,
      action: PayloadAction<[number, ZetkinEventParticipant]>
    ) => {
      const [eventId, participant] = action.payload;
      state.participantsByEventId[eventId].items.push(
        remoteItem(participant.id, { data: participant })
      );
      const event = state.eventList.items.find(
        (e) => e?.data?.id === eventId
      )?.data;
      if (event) {
        updateAvailParticipantToState(state, event);
      }
    },
    participantDeleted: (state, action: PayloadAction<[number, number]>) => {
      const [eventId, participantId] = action.payload;
      state.participantsByEventId[eventId].items = state.participantsByEventId[
        eventId
      ].items.filter((participant) => participant.id !== participantId);
    },
    participantOpAdd: (state, action: PayloadAction<ParticipantOp>) => {
      const newOp = action.payload;
      const existingInverseOp = state.pendingParticipantOps.find(
        (existingOp) =>
          existingOp.eventId == newOp.eventId &&
          existingOp.personId == newOp.personId &&
          existingOp.kind != newOp.kind
      );

      if (existingInverseOp) {
        state.pendingParticipantOps = state.pendingParticipantOps.filter(
          (op) => op != existingInverseOp
        );
      } else {
        state.pendingParticipantOps.push(newOp);
      }
    },
    participantOpsClear: (state) => {
      state.pendingParticipantOps = [];
    },
    participantOpsExecuted: (state) => {
      while (state.pendingParticipantOps.length) {
        const op = state.pendingParticipantOps.pop();
        if (!op) {
          return;
        }

        const eventItem = state.eventList.items.find(
          (item) => item.id == op.eventId
        );
        if (eventItem) {
          eventItem.isStale = true;
        }

        const participantsList = state.participantsByEventId[op.eventId];
        if (participantsList) {
          participantsList.isStale = true;
        }

        const statsItem = state.statsByEventId[op.eventId];
        if (statsItem) {
          statsItem.isStale = true;
        }
      }
    },
    participantUpdated: (
      state,
      action: PayloadAction<[number, ZetkinEventParticipant]>
    ) => {
      const [eventId, participant] = action.payload;
      const item = state.participantsByEventId[eventId].items.find(
        (item) => item.id === participant.id
      );

      if (item) {
        item.data = { ...item.data, ...participant };
        item.mutating = [];
      } else {
        state.participantsByEventId[eventId].items.push(
          remoteItem(participant.id, { data: participant })
        );
      }

      if (participant.cancelled) {
        const event = state.eventList.items.find(
          (e) => e?.data?.id === eventId
        )?.data;
        if (event) {
          updateAvailParticipantToState(state, event);
          // If cancelled participant was contact for event, also remove contact
          if (event.contact?.id == participant.id) {
            event.contact = null;
          }
        }
      }
    },
    participantsLoad: (state, action: PayloadAction<number>) => {
      const eventId = action.payload;
      if (!state.participantsByEventId[eventId]) {
        state.participantsByEventId[eventId] = remoteList();
      }

      state.participantsByEventId[eventId].isLoading = true;
    },
    participantsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinEventParticipant[]]>
    ) => {
      const [eventId, participants] = action.payload;
      state.participantsByEventId[eventId] = remoteList(participants);
      state.participantsByEventId[eventId].loaded = new Date().toISOString();
    },
    participantsRemind: (state, action: PayloadAction<number>) => {
      const eventId = action.payload;
      state.remindingByEventId[eventId] = true;
    },
    participantsReminded: (state, action: PayloadAction<number>) => {
      const eventId = action.payload;
      state.remindingByEventId[eventId] = false;
      state.participantsByEventId[eventId].items.map((item) => {
        if (item.data && item.data?.reminder_sent == null) {
          item.data = { ...item.data, reminder_sent: new Date().toISOString() };
        }
      });
    },
    resetSelection: (state) => {
      state.selectedEventIds = [];
    },
    respondentsLoad: (state, action: PayloadAction<number>) => {
      const eventId = action.payload;
      if (!state.respondentsByEventId[eventId]) {
        state.respondentsByEventId[eventId] = remoteList();
      }

      state.respondentsByEventId[eventId].isLoading = true;
    },
    respondentsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinEventResponse[]]>
    ) => {
      const [eventId, respondents] = action.payload;
      state.respondentsByEventId[eventId] = remoteList(respondents);
      state.respondentsByEventId[eventId].loaded = new Date().toISOString();
    },
    statsLoad: (state, action: PayloadAction<number>) => {
      const eventId = action.payload;
      state.statsByEventId[eventId] = remoteItem<EventStats>(eventId);
      state.statsByEventId[eventId].isLoading = true;
    },
    statsLoaded: (state, action: PayloadAction<[number, EventStats]>) => {
      const [eventId, stats] = action.payload;
      state.statsByEventId[eventId].data = stats;
      state.statsByEventId[eventId].isLoading = false;
      state.statsByEventId[eventId].loaded = new Date().toISOString();
    },
    typeAdd: (
      state,
      /* eslint-disable-next-line */
      action: PayloadAction<[number, ZetkinEventTypePostBody]>
    ) => {
      state.typeList.isLoading = true;
    },
    typeAdded: (state, action: PayloadAction<ZetkinActivity>) => {
      const data = action.payload;

      state.typeList.items = state.typeList.items.concat([
        remoteItem(data.id, { data: data, isLoading: false }),
      ]);
    },
    typeDeleted: (state, action: PayloadAction<number>) => {
      const typeId = action.payload;
      const typeListItem = state.typeList.items.find(
        (item) => item.id === typeId
      );

      if (typeListItem) {
        typeListItem.deleted = true;
      }

      state.typeList.items = state.typeList.items.filter(
        (type) => type.id !== typeId
      );
    },
    typeLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.typeList.items.find((item) => item.id == id);
      state.typeList.items = state.typeList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    typeLoaded: (state, action: PayloadAction<ZetkinActivity>) => {
      const activity = action.payload;
      const item = state.typeList.items.find((item) => item.id == activity.id);

      if (!item) {
        throw new Error('Finished loading item that never started loading');
      }

      item.data = activity;
      item.isLoading = false;
      item.loaded = new Date().toISOString();
    },
    /* eslint-disable-next-line */
    typesLoad: (state, action: PayloadAction<number>) => {
      state.typeList.isLoading = true;
    },
    typesLoaded: (state, action: PayloadAction<[number, ZetkinActivity[]]>) => {
      const [, eventTypes] = action.payload;
      state.typeList = remoteList(eventTypes);
      state.typeList.loaded = new Date().toISOString();
    },
  },
});

function addEventToState(state: EventsStoreSlice, events: ZetkinEvent[]) {
  events.forEach((event) => {
    const eventListItem = state.eventList.items.find(
      (item) => item.id == event.id
    );

    if (eventListItem) {
      eventListItem.data = { ...eventListItem.data, ...event };
    } else {
      state.eventList.items.push(
        remoteItem(event.id, { data: event, loaded: new Date().toISOString() })
      );
    }

    const dateStr = event.start_time.slice(0, 10);
    if (!state.eventsByDate[dateStr]) {
      state.eventsByDate[dateStr] = remoteList();
    }
    let oldDateStr: string | undefined = undefined;
    for (const date in state.eventsByDate) {
      const item = state.eventsByDate[date].items.find(
        (item) => item.id == event.id
      );
      if (item) {
        oldDateStr = item.data?.start_time.slice(0, 10);
      }
    }

    if (oldDateStr) {
      // When updating an event date, remove the old date's event from state.eventsByDate and push that event to the new date.
      const filteredEvents = state.eventsByDate[oldDateStr].items.filter(
        (item) => item.data?.id !== event.id
      );

      state.eventsByDate[oldDateStr].items = filteredEvents;
      state.eventsByDate[dateStr].items.push(
        remoteItem(event.id, { data: event })
      );
    } else {
      //This is to check if the event already exists. In some places, addEventToState might be called more than once.
      const newDateEventNotExists = !state.eventsByDate[dateStr].items.some(
        (item) => item?.data?.id === event.id
      );

      if (newDateEventNotExists) {
        state.eventsByDate[dateStr].items.push(
          remoteItem(event.id, { data: event })
        );
      }
    }

    state.eventsByDate[dateStr].isLoading = false;
    state.eventsByDate[dateStr].isStale = false;
    state.eventsByDate[dateStr].loaded = new Date().toISOString();

    const campaign = event.campaign;
    if (campaign) {
      if (!state.eventsByCampaignId[campaign.id]) {
        state.eventsByCampaignId[campaign.id] = remoteList();
      }

      const eventByCampIdItem = state.eventsByCampaignId[
        campaign.id
      ].items.find((item) => item.id == event.id);

      if (eventByCampIdItem) {
        eventByCampIdItem.data = { ...eventByCampIdItem.data, ...event };
        eventByCampIdItem.mutating = [];
      } else {
        state.eventsByCampaignId[campaign.id].items.push(
          remoteItem(event.id, { data: event })
        );
      }
    }
  });
}

function updateAvailParticipantToState(
  state: EventsStoreSlice,
  event: ZetkinEvent
) {
  const numAvailParticipants = state.participantsByEventId[
    event.id
  ].items.filter((participant) => !participant.data?.cancelled).length;
  event.num_participants_available = numAvailParticipants;

  const dateStr = event.start_time.slice(0, 10);
  const eventByDateItem = state.eventsByDate[dateStr].items.find(
    (item) => item.id === event.id
  );
  if (eventByDateItem?.data) {
    eventByDateItem.data.num_participants_available = numAvailParticipants;
  }

  if (event.campaign) {
    const eventByCampIdItem = state.eventsByCampaignId[
      event.campaign.id
    ].items.find((item) => item.id === event.id);

    if (eventByCampIdItem?.data) {
      eventByCampIdItem.data.num_participants_available = numAvailParticipants;
    }
  }

  if (state.statsByEventId[event.id]) {
    state.statsByEventId[event.id].isStale = true;
  }
}

export default eventsSlice;
export const {
  campaignEventsLoad,
  campaignEventsLoaded,
  eventCreate,
  eventCreated,
  eventDeleted,
  eventLoad,
  eventLoaded,
  eventRangeLoad,
  eventRangeLoaded,
  eventsCreate,
  eventsCreated,
  eventsLoad,
  eventsLoaded,
  eventUpdate,
  eventUpdated,
  eventsDeselected,
  eventsSelected,
  eventsUpdate,
  eventsUpdated,
  filterTextUpdated,
  filterUpdated,
  locationLoad,
  locationLoaded,
  locationUpdate,
  locationUpdated,
  locationAdded,
  locationsLoad,
  locationsLoaded,
  participantAdded,
  participantDeleted,
  participantOpAdd,
  participantOpsClear,
  participantOpsExecuted,
  participantUpdated,
  participantsLoad,
  participantsLoaded,
  participantsRemind,
  participantsReminded,
  resetSelection,
  respondentsLoad,
  respondentsLoaded,
  statsLoad,
  statsLoaded,
  typeAdd,
  typeAdded,
  typeDeleted,
  typeLoad,
  typeLoaded,
  typesLoad,
  typesLoaded,
} = eventsSlice.actions;
