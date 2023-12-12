import { EmailStats } from './types';
import { ZetkinEmail } from 'utils/types/zetkin';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  RemoteItem,
  remoteItem,
  RemoteList,
  remoteList,
} from 'utils/storeUtils';

export interface EmailStoreSlice {
  emailList: RemoteList<ZetkinEmail>;
  statsById: Record<number, RemoteItem<EmailStats>>;
}

const initialState: EmailStoreSlice = {
  emailList: remoteList(),
  statsById: {},
};

const emailsSlice = createSlice({
  initialState,
  name: 'emails',
  reducers: {
    emailCreate: (state) => {
      state.emailList.isLoading = true;
    },
    emailCreated: (state, action: PayloadAction<[ZetkinEmail, number]>) => {
      const [email] = action.payload;
      state.emailList.isLoading = false;
      state.emailList.items.push(remoteItem(email.id, { data: email }));
    },
    emailLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.emailList.items.find((item) => item.id == id);
      state.emailList.items = state.emailList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    emailLoaded: (state, action: PayloadAction<ZetkinEmail>) => {
      const id = action.payload.id;
      const item = state.emailList.items.find((item) => item.id == id);
      if (item) {
        item.data = action.payload;
        item.loaded = new Date().toISOString();
        item.isLoading = false;
        item.isStale = false;
      }
    },
    emailUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [id, mutating] = action.payload;
      const item = state.emailList.items.find((item) => item.id == id);
      if (item) {
        item.mutating = mutating;
      }
    },
    emailUpdated: (state, action: PayloadAction<[ZetkinEmail, string[]]>) => {
      const [email, mutating] = action.payload;
      const item = state.emailList.items.find((item) => item.id == email.id);
      if (item) {
        item.mutating = item.mutating.filter(
          (attr) => !mutating.includes(attr)
        );
        if (item.data) {
          item.data = email;
        }
      }
    },
    statsLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const statsItem = state.statsById[id];
      state.statsById[id] = remoteItem<EmailStats>(id, {
        data: statsItem?.data || { allTargets: 0, id: id },
        isLoading: true,
      });
    },
    statsLoaded: (state, action: PayloadAction<EmailStats>) => {
      state.statsById[action.payload.id] = remoteItem<EmailStats>(
        action.payload.id,
        {
          data: action.payload,
          isLoading: false,
          isStale: false,
          loaded: new Date().toISOString(),
        }
      );
    },
  },
});

export default emailsSlice;
export const {
  emailCreate,
  emailCreated,
  emailLoad,
  emailLoaded,
  emailUpdate,
  emailUpdated,
  statsLoad,
  statsLoaded,
} = emailsSlice.actions;
