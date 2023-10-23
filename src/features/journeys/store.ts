import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { remoteItem, RemoteList, remoteList } from 'utils/storeUtils';
import { ZetkinJourney, ZetkinJourneyInstance } from 'utils/types/zetkin';

export interface JourneysStoreSlice {
  journeyInstanceList: RemoteList<ZetkinJourneyInstance>;
  journeyList: RemoteList<ZetkinJourney>;
}

const initialJourneysState: JourneysStoreSlice = {
  journeyInstanceList: remoteList(),
  journeyList: remoteList(),
};

const journeysSlice = createSlice({
  initialState: initialJourneysState,
  name: 'journeys',
  reducers: {
    journeyInstanceCreate: (state) => {
      state.journeyInstanceList.isLoading = true;
    },
    journeyInstanceCreated: (
      state,
      action: PayloadAction<ZetkinJourneyInstance>
    ) => {
      const journeyInstance = action.payload;
      state.journeyInstanceList.isLoading = false;
      state.journeyInstanceList.items.push(
        remoteItem(journeyInstance.id, { data: journeyInstance })
      );
    },
    journeyInstanceLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.journeyInstanceList.items.find(
        (item) => item.id == id
      );
      state.journeyInstanceList.items = state.journeyInstanceList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    journeyInstanceLoaded: (
      state,
      action: PayloadAction<ZetkinJourneyInstance>
    ) => {
      const id = action.payload.id;
      const item = state.journeyInstanceList.items.find(
        (item) => item.id == id
      );

      if (!item) {
        throw new Error(
          'Finished loading something that never started loading'
        );
      }

      item.data = action.payload;
      item.loaded = new Date().toISOString();
      item.isLoading = false;
      item.isStale = false;
    },
    journeyLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.journeyList.items.find((item) => item.id == id);
      state.journeyList.items = state.journeyList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    journeyLoaded: (state, action: PayloadAction<ZetkinJourney>) => {
      const id = action.payload.id;
      const item = state.journeyList.items.find((item) => item.id == id);

      if (!item) {
        throw new Error(
          'Finished loading something that never started loading'
        );
      }

      item.data = action.payload;
      item.loaded = new Date().toISOString();
      item.isLoading = false;
      item.isStale = false;
    },
    journeysLoad: (state) => {
      state.journeyList.isLoading = true;
    },
    journeysLoaded: (state, action: PayloadAction<ZetkinJourney[]>) => {
      const journeys = action.payload;
      const timestamp = new Date().toISOString();
      state.journeyList = remoteList(journeys);
      state.journeyList.loaded = timestamp;
      state.journeyList.items.forEach((item) => (item.loaded = timestamp));
    },
  },
});

export default journeysSlice;
export const {
  journeyInstanceCreate,
  journeyInstanceCreated,
  journeyInstanceLoad,
  journeyInstanceLoaded,
  journeyLoad,
  journeyLoaded,
  journeysLoad,
  journeysLoaded,
} = journeysSlice.actions;
