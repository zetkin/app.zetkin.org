import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinJourney } from 'utils/types/zetkin';
import { remoteItem, RemoteList, remoteList } from 'utils/storeUtils';

export interface JourneysStoreSlice {
  journeysList: RemoteList<ZetkinJourney>;
}

const initialJourneysState: JourneysStoreSlice = {
  journeysList: remoteList(),
};

const journeysSlice = createSlice({
  initialState: initialJourneysState,
  name: 'journeys',
  reducers: {
    journeyLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.journeysList.items.find((item) => item.id == id);
      state.journeysList.items = state.journeysList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    journeyLoaded: (state, action: PayloadAction<ZetkinJourney>) => {
      const id = action.payload.id;
      const item = state.journeysList.items.find((item) => item.id == id);

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
      state.journeysList.isLoading = true;
    },
    journeysLoaded: (state, action: PayloadAction<ZetkinJourney[]>) => {
      const journeys = action.payload;
      const timestamp = new Date().toISOString();
      state.journeysList = remoteList(journeys);
      state.journeysList.loaded = timestamp;
      state.journeysList.items.forEach((item) => (item.loaded = timestamp));
    },
  },
});

export default journeysSlice;
export const { journeyLoad, journeyLoaded, journeysLoad, journeysLoaded } =
  journeysSlice.actions;
