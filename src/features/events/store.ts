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
  selectedEvents: number[];
  statsByEventId: Record<number, RemoteItem<EventStats>>;
  typeList: RemoteList<ZetkinActivity>;
}

const initialState: EventsStoreSlice = {
  eventList: remoteList(),
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
  selectedEvents: [],
  statsByEventId: {},
  typeList: remoteList(),
};

const eventsSlice = createSlice({
  initialState,
  name: 'events',
  reducers: {
    eventCreate: (state) => {
      state.eventList.isLoading = true;
    },
    eventCreated: (state, action: PayloadAction<ZetkinEvent>) => {
      const event = action.payload;
      state.eventList.isLoading = false;
      state.eventList.items.push(remoteItem(event.id, { data: event }));
    },
    eventDeleted: (state, action: PayloadAction<number>) => {
      const eventId = action.payload;
      state.eventList.items = state.eventList.items.filter(
        (item) => item.id != eventId
      );
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
    },
    eventsDeselected: (state, action: PayloadAction<ZetkinEvent[]>) => {
      const toggledEvents = action.payload;

      if (toggledEvents.length === 0) {
        state.selectedEvents = [];
      } else {
        state.selectedEvents = state.selectedEvents.filter(
          (selectedEvent) =>
            !toggledEvents.some((event) => event.id == selectedEvent)
        );
      }
    },
    eventsLoad: (state) => {
      state.eventList.isLoading = true;
    },
    eventsLoaded: (state, action: PayloadAction<ZetkinEvent[]>) => {
      state.eventList = remoteList(action.payload);
      state.eventList.loaded = new Date().toISOString();
    },
    eventsSelected: (state, action: PayloadAction<ZetkinEvent[]>) => {
      const checkedEvents = action.payload;

      state.selectedEvents = [
        ...state.selectedEvents,
        ...checkedEvents
          .filter(
            (event) =>
              !state.selectedEvents.some(
                (selectedEvent) => event.id == selectedEvent
              )
          )
          .map((filtered) => filtered.id),
      ];
      // if (checkedEvents.length > 1) {
      // } else {
      //   state.selectedEvents = [
      //     ...state.selectedEvents,
      //     ...checkedEvents.map((filtered) => filtered.id),
      //   ];
      // }
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
  eventCreate,
  eventCreated,
  eventDeleted,
  eventLoad,
  eventLoaded,
  eventRangeLoad,
  eventRangeLoaded,
  eventsLoad,
  eventsLoaded,
  eventUpdate,
  eventUpdated,
  eventsDeselected,
  eventsSelected,
  filterTextUpdated,
  filterUpdated,
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
  respondentsLoad,
  respondentsLoaded,
  statsLoad,
  statsLoaded,
  typeAdd,
  typeAdded,
  typesLoad,
  typesLoaded,
} = eventsSlice.actions;
