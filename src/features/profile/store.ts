import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PersonOrganization } from 'utils/organize/people';
import {
  RemoteItem,
  remoteItem,
  remoteItemLoad,
  remoteItemUpdate,
  remoteItemUpdated,
  RemoteList,
  remoteList,
} from 'utils/storeUtils';
import { ZetkinCustomField, ZetkinPerson } from 'utils/types/zetkin';
import { ZetkinPersonNote } from './types';
import { findOrAddItem } from 'utils/storeUtils/findOrAddItem';

export type PersonOrgData = {
  id: string;
  memberships: PersonOrganization[];
  organizationTree: PersonOrganization;
  personOrganizationTree: PersonOrganization;
  subOrganizations: PersonOrganization[];
};

type SerializedError = {
  message: string;
  name: string;
};

export interface ProfilesStoreSlice {
  fieldCreateError: SerializedError | null;
  fieldUpdateError: SerializedError | null;
  fieldsList: RemoteList<ZetkinCustomField>;
  orgsByPersonId: Record<number, RemoteItem<PersonOrgData>>;
  notesByPersonId: Record<number, RemoteList<ZetkinPersonNote>>;
  personById: Record<number, RemoteItem<ZetkinPerson>>;
}

const initialState: ProfilesStoreSlice = {
  fieldCreateError: null,
  fieldUpdateError: null,
  fieldsList: remoteList(),
  notesByPersonId: {},
  orgsByPersonId: {},
  personById: {},
};

const profilesSlice = createSlice({
  initialState,
  name: 'profiles',
  reducers: {
    fieldCreate: (state) => {
      state.fieldsList.isLoading = true;
    },
    fieldCreateErrorAdded: (state, action: PayloadAction<SerializedError>) => {
      const error = action.payload;
      state.fieldsList.isLoading = false;
      state.fieldCreateError = error;
    },
    fieldCreateErrorRemoved: (state) => {
      state.fieldCreateError = null;
    },
    fieldCreated: (state, action: PayloadAction<ZetkinCustomField>) => {
      const field = action.payload;

      state.fieldsList.items = state.fieldsList.items.concat([
        remoteItem(field.id, { data: field, isLoading: false }),
      ]);
    },
    fieldLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const fieldsList = state.fieldsList;
      remoteItemLoad(fieldsList, id);
    },
    fieldLoaded: (state, action: PayloadAction<ZetkinCustomField>) => {
      const id = action.payload.id;
      const item = state.fieldsList.items.find((item) => item.id == id);

      if (!item) {
        throw new Error(
          'Finished loading something that never started loading'
        );
      }

      item.data = action.payload;
      item.loaded = new Date().toISOString();
      item.isLoading = false;
      item.isStale = false;
    },
    fieldRemoved: (state, action: PayloadAction<number>) => {
      const fieldId = action.payload;
      state.fieldsList.items = state.fieldsList.items.filter(
        (item) => item.id !== fieldId
      );
    },
    fieldUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [fieldId, mutating] = action.payload;
      remoteItemUpdate(state.fieldsList, fieldId, mutating);
    },
    fieldUpdateErrorAdded: (
      state,
      action: PayloadAction<[number, SerializedError]>
    ) => {
      const [fieldId, error] = action.payload;
      state.fieldUpdateError = error;
      const item = findOrAddItem(state.fieldsList, fieldId);
      item.mutating = [];
    },
    fieldUpdateErrorRemoved: (state) => {
      state.fieldUpdateError = null;
    },
    fieldUpdated: (state, action: PayloadAction<ZetkinCustomField>) => {
      const field = action.payload;
      remoteItemUpdated(state.fieldsList, field);
      state.fieldUpdateError = null;
    },
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
    personNoteAdded: (
      state,
      action: PayloadAction<[ZetkinPersonNote, number]>
    ) => {
      const [note, personId] = action.payload;
      if (!state.notesByPersonId[personId]) {
        state.notesByPersonId[personId] = remoteList();
      }
      state.notesByPersonId[personId].items = state.notesByPersonId[
        personId
      ].items
        .filter((c) => c.id != note.id)
        .concat([remoteItem(note.id, { data: note })]);
    },
    personNoteDelete: (state, action: PayloadAction<[number, number]>) => {
      const [personId, noteId] = action.payload;

      const noteItem = state.notesByPersonId[personId].items.find(
        (item) => item.id == noteId
      );

      if (noteItem) {
        noteItem.isLoading = true;
      }
    },
    personNoteDeleted: (state, action: PayloadAction<[number, number]>) => {
      const [personId, noteId] = action.payload;

      state.notesByPersonId[personId].items = state.notesByPersonId[
        personId
      ].items.filter((item) => item.id != noteId);
    },
    personNotesLoad: (state, action: PayloadAction<number>) => {
      const personId = action.payload;
      if (!state.notesByPersonId[personId]) {
        state.notesByPersonId[personId] = remoteList();
      }
      state.notesByPersonId[personId].isLoading = true;
    },
    personNotesLoaded: (
      state,
      action: PayloadAction<[number, ZetkinPersonNote[]]>
    ) => {
      const [personId, notes] = action.payload;
      if (!state.notesByPersonId[personId]) {
        state.notesByPersonId[personId] = remoteList();
      }
      state.notesByPersonId[personId] = remoteList(notes);
      state.notesByPersonId[personId].loaded = new Date().toISOString();
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
    personsDeleted: (state, action: PayloadAction<number[]>) => {
      const ids = action.payload;

      ids.forEach((id) => {
        if (state.personById[id]) {
          state.personById[id].deleted = true;
        }
      });
    },
    personsMerged: (state, action: PayloadAction<number[]>) => {
      const ids = action.payload;

      // The first one might be stale
      ids.forEach((id, index) => {
        const personItem = state.personById[id];
        if (personItem) {
          if (index == 0) {
            personItem.isStale = true;
          } else {
            personItem.deleted = true;
          }
        }
      });
    },
  },
});

export default profilesSlice;
export const {
  fieldCreateErrorAdded,
  fieldCreateErrorRemoved,
  fieldCreate,
  fieldCreated,
  fieldLoad,
  fieldLoaded,
  fieldUpdate,
  fieldUpdated,
  fieldRemoved,
  fieldsLoad,
  fieldsLoaded,
  fieldUpdateErrorAdded,
  fieldUpdateErrorRemoved,
  personLoad,
  personLoaded,
  personNoteAdded,
  personNoteDelete,
  personNoteDeleted,
  personNotesLoad,
  personNotesLoaded,
  personOrgsLoad,
  personOrgsLoaded,
  personOrgAdded,
  personOrgRemoved,
  personUpdate,
  personUpdated,
  personsDeleted,
  personsMerged,
} = profilesSlice.actions;
