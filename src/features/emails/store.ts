import { EmailStats } from './hooks/useEmailStats';
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
    emailCreated: (state, action: PayloadAction<ZetkinEmail>) => {
      const email = action.payload;
      state.emailList.isLoading = false;
      state.emailList.items.push(remoteItem(email.id, { data: email }));
    },
    emailDeleted: (state, action: PayloadAction<number>) => {
      const emailId = action.payload;
      state.emailList.items = state.emailList.items.filter(
        (item) => item.id != emailId
      );
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
      const statsItem = state.statsById[email.id];

      //Only set stats as stale if query or locked state has updated
      if (
        (statsItem && email.locked != item?.data?.locked) ||
        JSON.stringify(email.target.filter_spec) !=
          JSON.stringify(item?.data?.target.filter_spec)
      ) {
        statsItem.isStale = true;
      }

      if (item) {
        item.mutating = item.mutating.filter(
          (attr) => !mutating.includes(attr)
        );
        if (item.data) {
          item.data = email;
        }
      }

      state.emailList.items = state.emailList.items
        .filter((mail) => mail.id != email.id)
        .concat([remoteItem(email.id, { data: email })]);
    },
    emailsLoad: (state) => {
      state.emailList.isLoading = true;
    },
    emailsLoaded: (state, action: PayloadAction<ZetkinEmail[]>) => {
      const emails = action.payload;
      const timestamp = new Date().toISOString();
      state.emailList = remoteList(emails);
      state.emailList.loaded = timestamp;
      state.emailList.items.forEach((item) => (item.loaded = timestamp));
    },
    statsLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const statsItem = state.statsById[id];
      state.statsById[id] = remoteItem<EmailStats>(id, {
        data: statsItem?.data || {
          id,
          num_blocked: {
            any: 0,
            blacklisted: 0,
            no_email: 0,
            unsubscribed: 0,
          },
          num_clicked: 0,
          num_locked_targets: 0,
          num_opened: 0,
          num_sent: 0,
          num_target_matches: 0,
        },
        isLoading: true,
      });
    },
    statsLoaded: (
      state,
      action: PayloadAction<EmailStats & { id: number }>
    ) => {
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
  emailDeleted,
  emailLoad,
  emailLoaded,
  emailUpdate,
  emailUpdated,
  emailsLoad,
  emailsLoaded,
  statsLoad,
  statsLoaded,
} = emailsSlice.actions;
