import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { remoteList, RemoteList } from 'utils/storeUtils';
import { ZetkinEmail, ZetkinLink } from 'utils/types/zetkin';

export interface EmailsStoreSlice {
  emailList: RemoteList<ZetkinEmail>;
  linkList: RemoteList<ZetkinLink>;
}

const initialState: EmailsStoreSlice = {
  emailList: remoteList(),
  linkList: remoteList(),
};

const emailsSlice = createSlice({
  initialState: initialState,
  name: 'emails',
  reducers: {
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
    linksLoad: (state) => {
      state.linkList.isLoading = true;
    },
    linksLoaded: (state, action: PayloadAction<ZetkinLink[]>) => {
      const links = action.payload;
      const timestamp = new Date().toISOString();

      state.linkList = remoteList(links);
      state.linkList.loaded = timestamp;
      state.linkList.items.forEach((item) => (item.loaded = timestamp));
    },
  },
});

export default emailsSlice;
export const { emailsLoad, emailsLoaded, linksLoad, linksLoaded } =
  emailsSlice.actions;
