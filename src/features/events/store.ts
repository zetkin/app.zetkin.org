import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  RemoteItem,
  remoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import {
  ZetkinEvent,
  ZetkinEventParticipant,
  ZetkinLocation,
} from 'utils/types/zetkin';

export type EventStats = {
  id: number;
  numBooked: number;
  numPending: number;
  numReminded: number;
  numSignups: number;
};

export interface EventsStoreSlice {
  eventList: RemoteList<ZetkinEvent>;
  locationList: RemoteList<ZetkinLocation>;
  participantsByEventId: Record<number, RemoteList<ZetkinEventParticipant>>;
  statsByEventId: Record<number, RemoteItem<EventStats>>;
}

const initialState: EventsStoreSlice = {
  eventList: remoteList(),
  locationList: remoteList(),
  participantsByEventId: {},
  statsByEventId: {},
};

const eventsSlice = createSlice({
  initialState,
  name: 'events',
  reducers: {
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
    locationsLoad: (state) => {
      state.locationList.isLoading = true;
    },
    locationsLoaded: (state, action: PayloadAction<ZetkinLocation[]>) => {
      const locations = action.payload;
      const timestamp = new Date().toISOString();
      state.locationList = remoteList(locations);
      state.locationList.loaded = timestamp;
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
  },
});

export default eventsSlice;
export const {
  eventLoad,
  eventLoaded,
  eventsLoad,
  eventsLoaded,
  eventUpdate,
  eventUpdated,
  locationsLoad,
  locationsLoaded,
  participantsLoad,
  participantsLoaded,
  statsLoad,
  statsLoaded,
} = eventsSlice.actions;
