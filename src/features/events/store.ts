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
  MISSING = 'Contact person missing',
  UNSENT = 'Unsent notifications',
  PENDING = 'Signups pending',
  UNDERBOOKED = 'Underbooked',
  OVERBOOKED = 'Overbooked',
}
export enum STATE_FILTER_OPTIONS {
  CANCELLED = 'Cancelled',
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  SCHEDULED = 'Scheduled',
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
  | number;

type FilterType = {
  filterCategory: string;
  selectedFilterValue: EventFilterOptions[];
};
export interface EventsStoreSlice {
  eventList: RemoteList<ZetkinEvent>;
  filters: {
    selectedActions: ACTION_FILTER_OPTIONS[];
    selectedStates: STATE_FILTER_OPTIONS[];
    selectedTypes: number[];
  };
  locationList: RemoteList<ZetkinLocation>;
  participantsByEventId: Record<number, RemoteList<ZetkinEventParticipant>>;
  respondentsByEventId: Record<number, RemoteList<ZetkinEventResponse>>;
  statsByEventId: Record<number, RemoteItem<EventStats>>;
  typeList: RemoteList<ZetkinActivity>;
}

const initialState: EventsStoreSlice = {
  eventList: remoteList(),
  filters: { selectedActions: [], selectedStates: [], selectedTypes: [] },
  locationList: remoteList(),
  participantsByEventId: {},
  respondentsByEventId: {},
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
    eventsLoad: (state) => {
      state.eventList.isLoading = true;
    },
    eventsLoaded: (state, action: PayloadAction<ZetkinEvent[]>) => {
      state.eventList = remoteList(action.payload);
      state.eventList.loaded = new Date().toISOString();
    },
    filterUpdated: (state, action: PayloadAction<FilterType>) => {
      const { filterCategory, selectedFilterValue } = action.payload;

      if (filterCategory === 'actions') {
        state.filters.selectedActions = filterOptions(
          selectedFilterValue,
          state.filters.selectedActions
        ) as ACTION_FILTER_OPTIONS[];
      }

      if (filterCategory === 'states') {
        state.filters.selectedStates = filterOptions(
          selectedFilterValue,
          state.filters.selectedStates
        ) as STATE_FILTER_OPTIONS[];
      }

      function filterOptions(
        selectedFilterValue: EventFilterOptions[],
        selectedFilterItems: EventFilterOptions[]
      ) {
        const selectedFilterValueLength = selectedFilterValue.length;

        if (selectedFilterValueLength === 0) {
          return [];
        }

        const foundSelectedFilter = selectedFilterItems.find((item) =>
          selectedFilterValue.includes(item)
        );

        return selectedFilterItems
          .filter((item) => !selectedFilterValue.includes(item))
          .concat(
            foundSelectedFilter && selectedFilterValueLength === 1
              ? []
              : selectedFilterValue
          );
      }
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
      state.participantsByEventId[eventId].items = state.participantsByEventId[
        eventId
      ].items
        .filter((item) => item.id !== participant.id)
        .concat([remoteItem(participant.id, { data: participant })]);
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
        if (item.data && item.data?.reminder_sent !== null) {
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
  eventLoad,
  eventLoaded,
  eventsLoad,
  eventsLoaded,
  eventUpdate,
  eventUpdated,
  filterUpdated,
  locationUpdate,
  locationUpdated,
  locationAdded,
  locationsLoad,
  locationsLoaded,
  participantAdded,
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
