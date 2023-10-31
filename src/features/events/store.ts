import { isSameDate } from 'utils/dateUtils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
  participantsByEventId: Record<number, RemoteList<ZetkinEventParticipant>>;
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

      state.eventsByCampaignId[id] = remoteList<ZetkinEvent>(events);
      state.eventsByCampaignId[id].loaded = timestamp;
    },
    eventCreate: (state) => {
      state.eventList.isLoading = true;
    },
    eventCreated: (state, action: PayloadAction<ZetkinEvent>) => {
      const event = action.payload;
      state.eventList.isLoading = false;
      state.eventList.items.push(remoteItem(event.id, { data: event }));

      const dateStr = event.start_time.slice(0, 10);
      if (!state.eventsByDate[dateStr]) {
        state.eventsByDate[dateStr] = remoteList();
      }
      state.eventsByDate[dateStr].items.push(
        remoteItem(event.id, { data: event })
      );

      if (event.campaign) {
        if (!state.eventsByCampaignId[event.campaign.id]) {
          state.eventsByCampaignId[event.campaign.id] = remoteList();
        }
        state.eventsByCampaignId[event.campaign.id].items.push(
          remoteItem(event.id, { data: event })
        );
      }
    },
    eventDeleted: (state, action: PayloadAction<number>) => {
      const eventId = action.payload;
      state.eventList.items = state.eventList.items.filter(
        (item) => item.id != eventId
      );

      for (const date in state.eventsByDate) {
        state.eventsByDate[date].items = state.eventsByDate[date].items.filter(
          (item) => item.id != eventId
        );
      }

      for (const campaignId in state.eventsByCampaignId) {
        state.eventsByCampaignId[campaignId].items = state.eventsByCampaignId[
          campaignId
        ].items.filter((item) => item.id != eventId);
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

      item.data = event;
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
      action: PayloadAction<[string[], ZetkinEvent[]]>
    ) => {
      const [isoDateRange, events] = action.payload;

      // Add events to per-date map
      isoDateRange.forEach((isoDate) => {
        const dateStr = isoDate.slice(0, 10);
        state.eventsByDate[dateStr] = remoteList(
          events.filter((event) =>
            isSameDate(new Date(event.start_time), new Date(isoDate))
          )
        );
        state.eventsByDate[dateStr].loaded = new Date().toISOString();
      });

      // Add events to big list
      const loadedIds: (number | string)[] = events.map((event) => event.id);
      state.eventList.items = state.eventList.items
        .filter((oldItem) => {
          if (loadedIds.includes(oldItem.id)) {
            // This event exists in the freshly loaded list and should be removed
            // before appending the list so that it does not create duplicates.
            return false;
          }

          return true;
        })
        .concat(
          events.map((event) =>
            remoteItem(event.id, {
              data: event,
              loaded: new Date().toISOString(),
            })
          )
        );
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
      const item = state.eventList.items.find((item) => item.id == event.id);
      if (item) {
        item.data = { ...item.data, ...event };
        item.mutating = [];
      }

      for (const date in state.eventsByDate) {
        const item = state.eventsByDate[date].items.find(
          (item) => item.id == event.id
        );
        if (item) {
          item.data = { ...item.data, ...event };
          item.mutating = [];
        }
      }

      if (event.campaign) {
        const eventItem = state.eventsByCampaignId[
          event.campaign.id
        ].items.find((item) => item.id == event.id);
        if (eventItem) {
          eventItem.data = { ...eventItem.data, ...event };
          eventItem.mutating = [];
        }
      }
    },
    eventsCreate: (state) => {
      state.eventList.isLoading = true;
    },
    eventsCreated: (state, action: PayloadAction<ZetkinEvent[]>) => {
      const events = action.payload;
      events.map((event) => {
        state.eventList.items.push(remoteItem(event.id, { data: event }));

        const dateStr = event.start_time.slice(0, 10);
        if (!state.eventsByDate[dateStr]) {
          state.eventsByDate[dateStr] = remoteList();
        }
        state.eventsByDate[dateStr].items.push(
          remoteItem(event.id, { data: event })
        );

        if (event.campaign) {
          if (!state.eventsByCampaignId[event.campaign.id]) {
            state.eventsByCampaignId[event.campaign.id] = remoteList();
          }
          state.eventsByCampaignId[event.campaign.id].items.push(
            remoteItem(event.id, { data: event })
          );
        }
      });
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
      state.eventList = remoteList(action.payload);
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
        // If cancelled participant was contact for event, also remove contact
        const event = state.eventList.items.find(
          (e) => e?.data?.id === eventId
        );
        if (event?.data && event?.data?.contact?.id == participant.id) {
          event.data.contact = null;
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
    participantsReminded: (state, action: PayloadAction<number>) => {
      const eventId = action.payload;
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
    typeLoad: (state, action) => {
      const id = action.payload;
      const item = state.typeList.items.find((item) => item.id == id);
      state.typeList.items = state.typeList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    typeLoaded: (state, action) => {
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
  participantUpdated,
  participantsLoad,
  participantsLoaded,
  participantsReminded,
  resetSelection,
  respondentsLoad,
  respondentsLoaded,
  statsLoad,
  statsLoaded,
  typeAdd,
  typeAdded,
  typeLoad,
  typeLoaded,
  typesLoad,
  typesLoaded,
} = eventsSlice.actions;
