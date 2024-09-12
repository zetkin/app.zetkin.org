import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  findOrAddItem,
  remoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import {
  ZetkinArea,
  ZetkinIndividualCanvassAssignment,
  ZetkinCanvassAssignment,
  ZetkinPlace,
} from './types';

export interface AreasStoreSlice {
  areaList: RemoteList<ZetkinArea>;
  canvassAssignmentList: RemoteList<ZetkinCanvassAssignment>;
  individualAssignmentsByCanvassAssignmentId: Record<
    string,
    RemoteList<ZetkinIndividualCanvassAssignment>
  >;
  myAssignmentsList: RemoteList<ZetkinIndividualCanvassAssignment>;
  placeList: RemoteList<ZetkinPlace>;
}

const initialState: AreasStoreSlice = {
  areaList: remoteList(),
  canvassAssignmentList: remoteList(),
  individualAssignmentsByCanvassAssignmentId: {},
  myAssignmentsList: remoteList(),
  placeList: remoteList(),
};

const areasSlice = createSlice({
  initialState: initialState,
  name: 'areas',
  reducers: {
    areaCreated: (state, action: PayloadAction<ZetkinArea>) => {
      const area = action.payload;
      const item = remoteItem(area.id, {
        data: area,
        loaded: new Date().toISOString(),
      });

      state.areaList.items.push(item);
    },
    areaDeleted: (state, action: PayloadAction<string>) => {
      const deletedId = action.payload;
      state.areaList.items = state.areaList.items.filter(
        (item) => item.id != deletedId
      );
    },
    areaLoad: (state, action: PayloadAction<string>) => {
      const areaId = action.payload;
      const item = state.areaList.items.find((item) => item.id == areaId);

      if (item) {
        item.isLoading = true;
      } else {
        state.areaList.items = state.areaList.items.concat([
          remoteItem(areaId, { isLoading: true }),
        ]);
      }
    },
    areaLoaded: (state, action: PayloadAction<ZetkinArea>) => {
      const area = action.payload;
      const item = state.areaList.items.find((item) => item.id == area.id);

      if (!item) {
        throw new Error('Finished loading item that never started loading');
      }

      item.data = area;
      item.isLoading = false;
      item.loaded = new Date().toISOString();
    },
    areaUpdated: (state, action: PayloadAction<ZetkinArea>) => {
      const area = action.payload;
      const item = findOrAddItem(state.areaList, area.id);

      item.data = area;
      item.loaded = new Date().toISOString();
    },
    areasLoad: (state) => {
      state.areaList.isLoading = true;
    },
    areasLoaded: (state, action: PayloadAction<ZetkinArea[]>) => {
      const timestamp = new Date().toISOString();
      const areas = action.payload;
      state.areaList = remoteList(areas);
      state.areaList.loaded = timestamp;
      state.areaList.items.forEach((item) => (item.loaded = timestamp));
    },
    canvassAssignmentCreated: (
      state,
      action: PayloadAction<ZetkinCanvassAssignment>
    ) => {
      const canvassAssignment = action.payload;
      const item = remoteItem(canvassAssignment.id, {
        data: canvassAssignment,
        loaded: new Date().toISOString(),
      });

      state.canvassAssignmentList.items.push(item);
    },
    canvassAssignmentLoad: (state, action: PayloadAction<string>) => {
      const canvassAssId = action.payload;
      const item = state.canvassAssignmentList.items.find(
        (item) => item.id == canvassAssId
      );

      if (item) {
        item.isLoading = true;
      } else {
        state.canvassAssignmentList.items =
          state.canvassAssignmentList.items.concat([
            remoteItem(canvassAssId, { isLoading: true }),
          ]);
      }
    },
    canvassAssignmentLoaded: (
      state,
      action: PayloadAction<ZetkinCanvassAssignment>
    ) => {
      const canvassAssignment = action.payload;
      const item = state.canvassAssignmentList.items.find(
        (item) => item.id == canvassAssignment.id
      );

      if (!item) {
        throw new Error('Finished loading item that never started loading');
      }

      item.data = canvassAssignment;
      item.isLoading = false;
      item.loaded = new Date().toISOString();
    },
    individualAssignmentAdd: (
      state,
      action: PayloadAction<[string, number]>
    ) => {
      const [canvassAssId, personId] = action.payload;

      if (!state.individualAssignmentsByCanvassAssignmentId[canvassAssId]) {
        state.individualAssignmentsByCanvassAssignmentId[canvassAssId] =
          remoteList();
      }

      state.individualAssignmentsByCanvassAssignmentId[canvassAssId].items.push(
        remoteItem(personId, { isLoading: true })
      );
    },
    individualAssignmentAdded: (
      state,
      action: PayloadAction<[string, ZetkinIndividualCanvassAssignment]>
    ) => {
      const [canvassAssId, individualAssignment] = action.payload;

      if (!state.individualAssignmentsByCanvassAssignmentId[canvassAssId]) {
        state.individualAssignmentsByCanvassAssignmentId[canvassAssId] =
          remoteList();
      }

      state.individualAssignmentsByCanvassAssignmentId[canvassAssId].items =
        state.individualAssignmentsByCanvassAssignmentId[canvassAssId].items
          .filter((c) => c.id != individualAssignment.personId)
          .concat([
            remoteItem(individualAssignment.id, {
              data: individualAssignment,
            }),
          ]);
    },
    individualAssignmentUpdated: (
      state,
      action: PayloadAction<[string, ZetkinIndividualCanvassAssignment]>
    ) => {
      const [canvassAssId, individualAssignment] = action.payload;

      if (!state.individualAssignmentsByCanvassAssignmentId[canvassAssId]) {
        state.individualAssignmentsByCanvassAssignmentId[canvassAssId] =
          remoteList();
      }

      state.individualAssignmentsByCanvassAssignmentId[canvassAssId].items
        .filter((item) => item.id == individualAssignment.personId)
        .concat([
          remoteItem(individualAssignment.id, {
            data: individualAssignment,
          }),
        ]);
    },
    individualAssignmentsLoad: (state, action: PayloadAction<string>) => {
      const canvassAssId = action.payload;

      if (!state.individualAssignmentsByCanvassAssignmentId[canvassAssId]) {
        state.individualAssignmentsByCanvassAssignmentId[canvassAssId] =
          remoteList();
      }

      state.individualAssignmentsByCanvassAssignmentId[canvassAssId].isLoading =
        true;
    },
    individualAssignmentsLoaded: (
      state,
      action: PayloadAction<[string, ZetkinIndividualCanvassAssignment[]]>
    ) => {
      const [canvassAssId, individualAssignments] = action.payload;

      if (!state.individualAssignmentsByCanvassAssignmentId[canvassAssId]) {
        state.individualAssignmentsByCanvassAssignmentId[canvassAssId] =
          remoteList();
      }

      state.individualAssignmentsByCanvassAssignmentId[canvassAssId] =
        remoteList(individualAssignments);
      state.individualAssignmentsByCanvassAssignmentId[canvassAssId].loaded =
        new Date().toISOString();
    },
    myAssignmentsLoad: (state) => {
      state.myAssignmentsList.isLoading = true;
    },
    myAssignmentsLoaded: (
      state,
      action: PayloadAction<ZetkinIndividualCanvassAssignment[]>
    ) => {
      const individualAssignments = action.payload;
      const timestamp = new Date().toISOString();

      state.myAssignmentsList = remoteList(individualAssignments);
      state.myAssignmentsList.loaded = timestamp;
      state.myAssignmentsList.items.forEach(
        (item) => (item.loaded = timestamp)
      );
    },
    placeCreated: (state, action: PayloadAction<ZetkinPlace>) => {
      const place = action.payload;
      const item = remoteItem(place.id, {
        data: place,
        loaded: new Date().toISOString(),
      });

      state.placeList.items.push(item);
    },
    placeUpdated: (state, action: PayloadAction<ZetkinPlace>) => {
      const place = action.payload;
      const item = findOrAddItem(state.placeList, place.id);

      item.data = place;
      item.loaded = new Date().toISOString();
    },
    placesLoad: (state) => {
      state.placeList.isLoading = true;
    },
    placesLoaded: (state, action: PayloadAction<ZetkinPlace[]>) => {
      const timestamp = new Date().toISOString();
      const places = action.payload;
      state.placeList = remoteList(places);
      state.placeList.loaded = timestamp;
      state.placeList.items.forEach((item) => (item.loaded = timestamp));
    },
  },
});

export default areasSlice;
export const {
  areaCreated,
  areaDeleted,
  areaLoad,
  areaLoaded,
  areasLoad,
  areasLoaded,
  areaUpdated,
  individualAssignmentAdd,
  individualAssignmentAdded,
  individualAssignmentUpdated,
  individualAssignmentsLoad,
  individualAssignmentsLoaded,
  myAssignmentsLoad,
  myAssignmentsLoaded,
  canvassAssignmentCreated,
  canvassAssignmentLoad,
  canvassAssignmentLoaded,
  placeCreated,
  placesLoad,
  placesLoaded,
  placeUpdated,
} = areasSlice.actions;
