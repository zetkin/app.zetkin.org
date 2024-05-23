import { ZetkinPerson } from 'utils/types/zetkin';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RemoteList, remoteList } from 'utils/storeUtils';

export interface ZetkinDuplicate {
  duplicatePersons: ZetkinPerson[];
  dismissed: string | null;
  id: number;
  merged: string | null;
  organization: { id: number; title: string };
  status: 'merged' | 'dismissed' | 'pending';
}

export interface DuplicatesStoreSlice {
  duplicatesList: RemoteList<ZetkinDuplicate>;
}

const initialState: DuplicatesStoreSlice = {
  duplicatesList: remoteList(),
};

const duplicatesSlice = createSlice({
  initialState,
  name: 'duplicates',
  reducers: {
    dismissedDuplicate: (state, action: PayloadAction<ZetkinDuplicate>) => {
      const duplicate = action.payload;
      const item = state.duplicatesList.items.find(
        (item) => item.id === duplicate.id
      );

      if (item && item.data) {
        item.data.dismissed = duplicate.dismissed;
        item.data = { ...duplicate };
      }
    },
    duplicatesLoad: (state) => {
      state.duplicatesList.isLoading = true;
    },
    duplicatesLoaded: (state, action: PayloadAction<ZetkinDuplicate[]>) => {
      const duplicates = action.payload;

      state.duplicatesList = remoteList(duplicates);
      state.duplicatesList.isLoading = false;
      state.duplicatesList.loaded = new Date().toISOString();
    },
  },
});

export default duplicatesSlice;
export const { dismissedDuplicate, duplicatesLoad, duplicatesLoaded } =
  duplicatesSlice.actions;
