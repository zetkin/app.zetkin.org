import { ZetkinPerson } from 'utils/types/zetkin';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { remoteItem, RemoteList, remoteList } from 'utils/storeUtils';

export interface PotentialDuplicate {
  duplicates: ZetkinPerson[];
  dismissed: string | null;
  id: number;
  merged: string | null;
  organization: { id: number; title: string };
  status: 'merged' | 'dismissed' | 'pending';
}

export interface DuplicatesStoreSlice {
  duplicatesList: RemoteList<PotentialDuplicate>;
  notDuplicatesList: RemoteList<ZetkinPerson>;
}

const initialState: DuplicatesStoreSlice = {
  duplicatesList: remoteList(),
  notDuplicatesList: remoteList(),
};

const duplicatesSlice = createSlice({
  initialState,
  name: 'duplicates',
  reducers: {
    addedDuplicatePerson: (
      state,
      action: PayloadAction<[number, ZetkinPerson]>
    ) => {
      const [duplicateId, person] = action.payload;
      const duplicate = state.duplicatesList.items.find(
        (item) => item.id === duplicateId
      );

      if (duplicate && duplicate.data) {
        duplicate.data.duplicates.push(person);

        state.duplicatesList.items.push(
          remoteItem(duplicate.data.id, { data: duplicate.data })
        );
      }
      const nonDuplicates = state.notDuplicatesList.items.filter(
        (item) => item.id !== person.id
      );
      state.notDuplicatesList.items = nonDuplicates;
    },
    dismissedDuplicate: (state, action: PayloadAction<PotentialDuplicate>) => {
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
    duplicatesLoaded: (state, action: PayloadAction<PotentialDuplicate[]>) => {
      const duplicates = action.payload;

      state.duplicatesList = remoteList(duplicates);
      state.duplicatesList.isLoading = false;
      state.duplicatesList.loaded = new Date().toISOString();
    },
    removedDuplicatePerson: (
      state,
      action: PayloadAction<[number, ZetkinPerson]>
    ) => {
      const [duplicateId, person] = action.payload;
      const duplicate = state.duplicatesList.items.find(
        (item) => item.id === duplicateId
      );

      if (duplicate && duplicate.data) {
        const duplicatesPersonList = duplicate.data.duplicates.filter(
          (item) => item.id !== person.id
        );
        if (duplicatesPersonList) {
          duplicate.data.duplicates = duplicatesPersonList;

          state.duplicatesList.items.push(
            remoteItem(duplicate.data.id, { data: duplicate.data })
          );
        }
      }

      state.notDuplicatesList.items.push(
        remoteItem(person.id, { data: person })
      );
    },
  },
});

export default duplicatesSlice;
export const {
  addedDuplicatePerson,
  dismissedDuplicate,
  duplicatesLoad,
  duplicatesLoaded,
  removedDuplicatePerson,
} = duplicatesSlice.actions;
