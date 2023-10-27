import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SearchResult } from './components/types';
import { remoteList, RemoteList } from 'utils/storeUtils';

export type SearchResultItem = {
  id: string;
  result: SearchResult;
};

export interface SearchStoreSlice {
  matchesByQuery: Record<string, RemoteList<SearchResultItem>>;
}

const initialState: SearchStoreSlice = {
  matchesByQuery: {},
};

const searchSlice = createSlice({
  initialState,
  name: 'search',
  reducers: {
    resultsLoad: (state, action: PayloadAction<string>) => {
      const query = action.payload;
      state.matchesByQuery[query] = remoteList<SearchResultItem>();
      state.matchesByQuery[query].isLoading = true;
    },
    resultsLoaded: (
      state,
      action: PayloadAction<[string, SearchResultItem[]]>
    ) => {
      const [query, results] = action.payload;
      state.matchesByQuery[query] = remoteList(results);
      state.matchesByQuery[query].loaded = new Date().toISOString();
    },
  },
});

export default searchSlice;
export const { resultsLoad, resultsLoaded } = searchSlice.actions;
