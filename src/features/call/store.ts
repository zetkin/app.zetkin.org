import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinCall } from './types';
import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';
import { ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';

export interface CallStoreSlice {
  currentCallId: number | null;
  eventsByTargetId: Record<number, RemoteList<ZetkinEventWithStatus>>;
  outgoingCalls: RemoteList<ZetkinCall>;
}

const initialState: CallStoreSlice = {
  currentCallId: null,
  eventsByTargetId: {},
  outgoingCalls: remoteList(),
};

const CallSlice = createSlice({
  initialState,
  name: 'call',
  reducers: {
    activeEventsLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (!state.eventsByTargetId[id]) {
        state.eventsByTargetId[id] = remoteList();
      }

      state.eventsByTargetId[id].isLoading = true;
    },
    activeEventsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinEventWithStatus[]]>
    ) => {
      const [id, events] = action.payload;
      const eventsWithStatus = events.map((event) => ({
        ...event,
        status: null,
      }));

      state.eventsByTargetId[id] = remoteList(eventsWithStatus);
      state.eventsByTargetId[id].loaded = new Date().toISOString();
      state.eventsByTargetId[id].isLoading = false;
    },
    allocateNewCallLoad: (state) => {
      state.outgoingCalls.isLoading = true;
    },
    allocateNewCallLoaded: (state, action: PayloadAction<ZetkinCall>) => {
      state.currentCallId = action.payload.id;

      const callExists = state.outgoingCalls.items.some(
        (call) => call.id === action.payload.id
      );
      if (!callExists) {
        state.outgoingCalls.items.push(
          remoteItem(action.payload.id, {
            data: action.payload,
            isLoading: false,
            isStale: false,
            loaded: new Date().toISOString(),
          })
        );
      }

      state.outgoingCalls.isLoading = false;
    },
    currentCallDeleted: (state, action: PayloadAction<number>) => {
      const deletedCallId = action.payload;

      state.outgoingCalls.items = state.outgoingCalls.items.filter(
        (item) => item.id !== deletedCallId
      );

      const nextCall = state.outgoingCalls.items.find(
        (item) => item.data?.state === 0
      );

      state.currentCallId = nextCall ? Number(nextCall.id) : null;
    },
    outgoingCallsLoad: (state) => {
      state.outgoingCalls.isLoading = true;
    },
    outgoingCallsLoaded: (state, action: PayloadAction<ZetkinCall[]>) => {
      const payloadItems = action.payload.map((call) =>
        remoteItem(call.id, {
          data: call,
          isLoading: false,
          isStale: false,
          loaded: new Date().toISOString(),
        })
      );

      state.outgoingCalls.items = state.outgoingCalls.items
        .filter(
          (item) => !payloadItems.some((newItem) => newItem.id === item.id)
        )
        .concat(payloadItems);

      state.outgoingCalls.loaded = new Date().toISOString();
      state.outgoingCalls.isLoading = false;
    },
    targetSubmissionAdded: (
      state,
      action: PayloadAction<[number, ZetkinEvent]>
    ) => {
      const [targetId, event] = action.payload;

      const eventList = state.eventsByTargetId[targetId];
      const existingItem = eventList.items.find((item) => item.id === event.id);

      if (existingItem && existingItem.data) {
        existingItem.data = {
          ...existingItem.data,
          status: 'signedUp',
        };
      }
    },
    targetSubmissionDeleted: (
      state,
      action: PayloadAction<[number, number]>
    ) => {
      const [targetId, eventId] = action.payload;

      const eventList = state.eventsByTargetId[targetId];

      const existingItem = eventList.items.find((item) => item.id === eventId);

      if (existingItem && existingItem.data) {
        existingItem.data = {
          ...existingItem.data,
          status: null,
        };
      }
    },
  },
});

export default CallSlice;
export const {
  activeEventsLoad,
  activeEventsLoaded,
  currentCallDeleted,
  allocateNewCallLoad,
  allocateNewCallLoaded,
  outgoingCallsLoad,
  outgoingCallsLoaded,
  targetSubmissionAdded,
  targetSubmissionDeleted,
} = CallSlice.actions;
