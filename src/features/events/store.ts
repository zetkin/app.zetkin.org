import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';
import {
  ZetkinActivity,
  ZetkinActivityBody,
  ZetkinEvent,
} from 'utils/types/zetkin';

export interface EventsStoreSlice {
  eventList: RemoteList<ZetkinEvent>;
  eventTypeList: RemoteList<ZetkinActivity>;
}

const initialState: EventsStoreSlice = {
  eventList: remoteList(),
  eventTypeList: remoteList(),
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
    eventTypeAdd: (
      state,
      /* eslint-disable-next-line */
      action: PayloadAction<[number, ZetkinActivityBody]>
    ) => {
      state.eventTypeList.isLoading = true;
    },
    eventTypeAdded: (state, action: PayloadAction<ZetkinActivity>) => {
      const data = action.payload;

      state.eventTypeList.items = state.eventTypeList.items.concat([
        remoteItem(data.id, { data: data, isLoading: false }),
      ]);
    },
    /* eslint-disable-next-line */
    eventTypesLoad: (state, action: PayloadAction<number>) => {
      state.eventTypeList.isLoading = true;
    },
    eventTypesLoaded: (
      state,
      action: PayloadAction<[number, ZetkinActivity[]]>
    ) => {
      const [, eventTypes] = action.payload;
      state.eventTypeList = remoteList(eventTypes);
      state.eventTypeList.loaded = new Date().toISOString();
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
  },
});

export default eventsSlice;
export const {
  eventLoad,
  eventLoaded,
  eventTypeAdd,
  eventTypeAdded,
  eventTypesLoad,
  eventTypesLoaded,
  eventUpdate,
  eventUpdated,
} = eventsSlice.actions;
