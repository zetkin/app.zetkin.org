import { EmailTargets } from './types';
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
  targetsById: Record<number, RemoteItem<EmailTargets>>;
}

const initialState: EmailStoreSlice = {
  emailList: remoteList(),
  targetsById: {},
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
      const statsItem = state.targetsById[email.id];
      if (
        statsItem &&
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
    targetsLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const statsItem = state.targetsById[id];
      state.targetsById[id] = remoteItem<EmailTargets>(id, {
        data: statsItem?.data,
        isLoading: true,
      });
    },
    targetsLoaded: (state, action: PayloadAction<EmailTargets>) => {
      state.targetsById[action.payload.id] = remoteItem<EmailTargets>(
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
  targetsLoad,
  targetsLoaded,
} = emailsSlice.actions;
