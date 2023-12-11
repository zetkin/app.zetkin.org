import { ZetkinEmail } from 'utils/types/zetkin';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { remoteItem, RemoteList, remoteList } from 'utils/storeUtils';

export interface EmailStoreSlice {
  emailList: RemoteList<ZetkinEmail>;
}

const initialState: EmailStoreSlice = {
  emailList: remoteList(),
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
  },
});

export default emailsSlice;
export const { emailCreate, emailCreated, emailLoad, emailLoaded } =
  emailsSlice.actions;
