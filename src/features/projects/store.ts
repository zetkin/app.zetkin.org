import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dayjs } from 'dayjs';
import { DateRange } from '@mui/x-date-pickers-pro';

import { ZetkinProject } from 'utils/types/zetkin';
import { remoteItem, RemoteList, remoteList } from 'utils/storeUtils';

type ProjectEventFilters = {
  customDatesToFilterBy: DateRange<Dayjs>;
  dateFilterState: 'today' | 'tomorrow' | 'thisWeek' | 'custom' | null;
  eventTypesToFilterBy: string[];
  geojsonToFilterBy: GeoJSON.Feature[];
};

export interface ProjectsStoreSlice {
  projectList: RemoteList<ZetkinProject>;
  projectsByOrgId: Record<string, RemoteList<ZetkinProject>>;
  filters: ProjectEventFilters;
  recentlyCreatedProject: ZetkinProject | null;
}

const initialProjectsState: ProjectsStoreSlice = {
  filters: {
    customDatesToFilterBy: [null, null],
    dateFilterState: null,
    eventTypesToFilterBy: [],
    geojsonToFilterBy: [],
  },
  projectList: remoteList(),
  projectsByOrgId: {},
  recentlyCreatedProject: null,
};

const projectsSlice = createSlice({
  initialState: initialProjectsState,
  name: 'projects',
  reducers: {
    filtersUpdated: (
      state,
      action: PayloadAction<Partial<ProjectEventFilters>>
    ) => {
      const updatedFilters = action.payload;
      state.filters = { ...state.filters, ...updatedFilters };
    },
    projectCreate: (state) => {
      state.projectList.isLoading = true;
      state.recentlyCreatedProject = null;
    },
    projectCreated: (state, action: PayloadAction<ZetkinProject>) => {
      const project = action.payload;
      state.projectList.isLoading = false;
      state.projectList.items.push(remoteItem(project.id, { data: project }));
      state.recentlyCreatedProject = project;
    },
    projectDeleted: (
      state,
      action: PayloadAction<[orgId: number, projectId: number]>
    ) => {
      const projectId = action.payload[1];
      const projectItem = state.projectList.items.find(
        (item) => item.id === projectId
      );

      if (projectItem) {
        projectItem.deleted = true;
        state.projectList.isStale = true;
      }
    },
    projectLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.projectList.items.find((item) => item.id == id);
      state.projectList.items = state.projectList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    projectLoaded: (state, action: PayloadAction<ZetkinProject>) => {
      const id = action.payload.id;
      const item = state.projectList.items.find((item) => item.id == id);

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
    projectUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [id, attributes] = action.payload;
      const item = state.projectList.items.find((item) => item.id == id);

      if (item) {
        item.mutating = item.mutating
          .filter((attr) => !attributes.includes(attr))
          .concat(attributes);
      }
    },
    projectUpdated: (state, action: PayloadAction<ZetkinProject>) => {
      const project = action.payload;
      const item = state.projectList.items.find(
        (item) => item.id == project.id
      );

      if (item) {
        item.data = { ...item.data, ...project };
        item.mutating = [];
      }
    },
    projectsLoad: (state, action: PayloadAction<number[]>) => {
      const orgIds = action.payload;
      orgIds.forEach((orgId) => {
        const list = (state.projectsByOrgId[orgId] ||= remoteList());
        list.isLoading = true;
      });
      state.projectList.isLoading = true;
    },
    projectsLoaded: (state, action: PayloadAction<ZetkinProject[]>) => {
      const projects = action.payload;
      const timestamp = new Date().toISOString();

      projects.forEach((project) => {
        const orgId = project.organization.id;
        const listByOrg = (state.projectsByOrgId[orgId] ||=
          remoteList<ZetkinProject>([]));

        listByOrg.isLoading = false;
        listByOrg.loaded = timestamp;
        listByOrg.items.push(remoteItem(project.id, { data: project }));
      });

      state.projectList = remoteList(projects);
      state.projectList.loaded = timestamp;
      state.projectList.items.forEach((item) => (item.loaded = timestamp));
    },
  },
});

export default projectsSlice;
export const {
  projectCreate,
  projectCreated,
  projectDeleted,
  projectLoad,
  projectLoaded,
  projectUpdate,
  projectUpdated,
  projectsLoad,
  projectsLoaded,
  filtersUpdated,
} = projectsSlice.actions;
