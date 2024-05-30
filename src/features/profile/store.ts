import { PersonOrganization } from 'utils/organize/people';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  RemoteItem,
  remoteItem,
  RemoteList,
  remoteList,
} from 'utils/storeUtils';
import { ZetkinCustomField, ZetkinPerson } from 'utils/types/zetkin';

export type PersonOrgData = {
  id: string;
  memberships: PersonOrganization[];
  organizationTree: PersonOrganization;
  personOrganizationTree: PersonOrganization;
  subOrganizations: PersonOrganization[];
};

export interface ProfilesStoreSlice {
  fieldsList: RemoteList<ZetkinCustomField>;
  orgsByPersonId: Record<number, RemoteItem<PersonOrgData>>;
  personById: Record<number, RemoteItem<ZetkinPerson>>;
}

const initialState: ProfilesStoreSlice = {
  fieldsList: remoteList(),
  orgsByPersonId: {},
  personById: {},
};

const profilesSlice = createSlice({
  initialState,
  name: 'profiles',
  reducers: {
    fieldsLoad: (state) => {
      state.fieldsList.isLoading = true;
    },
    fieldsLoaded: (state, action: PayloadAction<ZetkinCustomField[]>) => {
      state.fieldsList = remoteList(action.payload);
      state.fieldsList.loaded = new Date().toISOString();
    },
    personLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.personById[id] = remoteItem(id, {
        data: state.personById[id]?.data,
        isLoading: true,
      });
    },
    personLoaded: (state, action: PayloadAction<[number, ZetkinPerson]>) => {
      const [id, data] = action.payload;
      state.personById[id] = remoteItem(id, {
        data,
        loaded: new Date().toISOString(),
      });
    },
    personOrgAdded: (state, action: PayloadAction<number>) => {
      const personId = action.payload;
      state.orgsByPersonId[personId].isStale = true;
    },
    personOrgRemoved: (state, action: PayloadAction<number>) => {
      const personId = action.payload;
      state.orgsByPersonId[personId].isStale = true;
    },
    personOrgsLoad: (state, action: PayloadAction<number>) => {
      const personId = action.payload;
      if (!state.orgsByPersonId[personId]) {
        state.orgsByPersonId[personId] = remoteItem(personId);
      }
      state.orgsByPersonId[personId].isLoading = true;
    },
    personOrgsLoaded: (
      state,
      action: PayloadAction<[number, PersonOrgData]>
    ) => {
      const [personId, orgs] = action.payload;
      state.orgsByPersonId[personId] = remoteItem(orgs.id, {
        data: orgs,
        loaded: new Date().toISOString(),
      });
    },
    personUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [personId, attributes] = action.payload;
      const item = state.personById[personId];

      if (item) {
        item.mutating = item.mutating
          .filter((attr) => !attributes.includes(attr))
          .concat(attributes);
      }
    },
    personUpdated: (state, action: PayloadAction<ZetkinPerson>) => {
      const person = action.payload;
      const item = state.personById[person.id];

      if (item) {
        item.data = { ...item.data, ...person };
        item.mutating = [];
      }
    },
  },
});

export default profilesSlice;
export const {
  fieldsLoad,
  fieldsLoaded,
  personLoad,
  personLoaded,
  personOrgsLoad,
  personOrgsLoaded,
  personOrgAdded,
  personOrgRemoved,
  personUpdate,
  personUpdated,
} = profilesSlice.actions;
