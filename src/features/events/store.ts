import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';
import {
  ZetkinActivity,
  ZetkinActivityBody,
  ZetkinEvent,
  ZetkinEventParticipant,
  ZetkinEventResponse,
  ZetkinLocation,
} from 'utils/types/zetkin';

export interface EventsStoreSlice {
  eventList: RemoteList<ZetkinEvent>;
  typeList: RemoteList<ZetkinActivity>;
  locationList: RemoteList<ZetkinLocation>;
  participantsByEventId: Record<number, RemoteList<ZetkinEventParticipant>>;
  respondentsByEventId: Record<number, RemoteList<ZetkinEventResponse>>;
}

const initialState: EventsStoreSlice = {
  eventList: remoteList(),
  locationList: remoteList(),
  participantsByEventId: {},
  respondentsByEventId: {},
  typeList: remoteList(),
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
    locationAdded: (state, action: PayloadAction<ZetkinLocation>) => {
      const location = action.payload;
      state.locationList.items = state.locationList.items
        .filter((l) => l.id !== location.id)
        .concat([remoteItem(location.id, { data: location })]);
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
      state.participantsByEventId[eventId].items
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
    typeAdd: (
      state,
      /* eslint-disable-next-line */
      action: PayloadAction<[number, ZetkinActivityBody]>
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
  typeAdd,
  typeAdded,
  typesLoad,
  typesLoaded,
} = eventsSlice.actions;
