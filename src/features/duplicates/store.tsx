import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinPerson } from 'utils/types/zetkin';
import { RemoteList, remoteList } from 'utils/storeUtils';

export interface PotentialDuplicate {
  duplicates: ZetkinPerson[];
  dismissed: string | null;
  id: number;
  merged: string | null;
  organization: { id: number; title: string };
  status: 'merged' | 'dismissed' | 'pending';
}

export interface PotentialDuplicatesStoreSlice {
  detailedPersonsList: Record<string, RemoteList<ZetkinPerson>>;
  potentialDuplicatesList: RemoteList<PotentialDuplicate>;
}

const initialState: PotentialDuplicatesStoreSlice = {
  detailedPersonsList: {},
  potentialDuplicatesList: remoteList(),
};

const potentialDuplicatesSlice = createSlice({
  initialState,
  name: 'potentialDuplicates',
  reducers: {
    detailedPersonsLoad: (state, action: PayloadAction<number[]>) => {
      const ids = action.payload;
      const key = ids.sort().join(',');
      state.detailedPersonsList[key] = remoteList();
      state.detailedPersonsList[key].isLoading = true;
    },
    detailedPersonsLoaded: (
      state,
      action: PayloadAction<[number[], ZetkinPerson[]]>
    ) => {
      const [ids, data] = action.payload;
      const key = ids.sort().join(',');
      state.detailedPersonsList[key] = remoteList(data);
      state.detailedPersonsList[key].loaded = new Date().toISOString();
    },
    duplicateMerged: (state, action: PayloadAction<number>) => {
      const mergedDuplicateId = action.payload;
      const potentialDuplicatesFiltered =
        state.potentialDuplicatesList.items.filter(
          (item) => item.id !== mergedDuplicateId
        );

      state.potentialDuplicatesList.items = potentialDuplicatesFiltered;
    },
    duplicateUpdated: (state, action: PayloadAction<PotentialDuplicate>) => {
      const potentialDuplicate = action.payload;
      const item = state.potentialDuplicatesList.items.find(
        (item) => item.id === potentialDuplicate.id
      );

      if (item && item.data) {
        item.data = potentialDuplicate;
      }
    },
    potentialDuplicatesLoad: (state) => {
      state.potentialDuplicatesList.isLoading = true;
    },
    potentialDuplicatesLoaded: (
      state,
      action: PayloadAction<PotentialDuplicate[]>
    ) => {
      const potentialDuplicates = action.payload;

      state.potentialDuplicatesList = remoteList(potentialDuplicates);
      state.potentialDuplicatesList.isLoading = false;
      state.potentialDuplicatesList.loaded = new Date().toISOString();
    },
  },
});

export default potentialDuplicatesSlice;
export const {
  detailedPersonsLoad,
  detailedPersonsLoaded,
  duplicateMerged,
  duplicateUpdated,
  potentialDuplicatesLoad,
  potentialDuplicatesLoaded,
} = potentialDuplicatesSlice.actions;
