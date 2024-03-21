import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { remoteList, RemoteList } from 'utils/storeUtils';
import { ZetkinEmail } from 'utils/types/zetkin';

export interface EmailsStoreSlice {
  emailList: RemoteList<ZetkinEmail>;
}

const initialState: EmailsStoreSlice = {
  emailList: remoteList(),
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
  },
});

export default emailsSlice;
export const { emailsLoad, emailsLoaded } = emailsSlice.actions;
