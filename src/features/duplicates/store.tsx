import { ZetkinPerson } from 'utils/types/zetkin';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
  potentialDuplicatesList: RemoteList<PotentialDuplicate>;
}

const initialState: PotentialDuplicatesStoreSlice = {
  potentialDuplicatesList: remoteList(),
};

const potentialDuplicatesSlice = createSlice({
  initialState,
  name: 'potentialDuplicates',
  reducers: {
    duplicateUpdated: (state, action: PayloadAction<PotentialDuplicate>) => {
      const potentialDuplicate = action.payload;
      const item = state.potentialDuplicatesList.items.find(
        (item) => item.id === potentialDuplicate.id
      );

      if (item && item.data) {
        item.data.dismissed = potentialDuplicate.dismissed;
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
  duplicateUpdated,
  potentialDuplicatesLoad,
  potentialDuplicatesLoaded,
} = potentialDuplicatesSlice.actions;
