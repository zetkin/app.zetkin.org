import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TaskStats } from './rpc/getTaskStats';
import { ZetkinTask } from './components/types';
import {
  RemoteItem,
  remoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';

export interface TasksStoreSlice {
  statsById: Record<number, RemoteItem<TaskStats>>;
  taskIdsByCampaignId: Record<number, RemoteList<{ id: string | number }>>;
  tasksList: RemoteList<ZetkinTask>;
}

const initialState: TasksStoreSlice = {
  statsById: {},
  taskIdsByCampaignId: {},
  tasksList: remoteList(),
};

const tasksSlice = createSlice({
  initialState,
  name: 'tasks',
  reducers: {
    campaignTaskIdsLoad: (state, action: PayloadAction<number>) => {
      const campaignId = action.payload;
      if (!state.taskIdsByCampaignId[campaignId]) {
        state.taskIdsByCampaignId[campaignId] = remoteList();
      }
      state.taskIdsByCampaignId[campaignId].isLoading = true;
    },
    campaignTaskIdsLoaded: (
      state,
      action: PayloadAction<[number, { id: number | string }[]]>
    ) => {
      const [campaignId, taskIds] = action.payload;
      const timestamp = new Date().toISOString();
      state.taskIdsByCampaignId[campaignId] = remoteList(taskIds);
      state.taskIdsByCampaignId[campaignId].loaded = timestamp;
    },
    statsLoad: (state, action: PayloadAction<number>) => {
      const taskId = action.payload;
      state.statsById[taskId] = remoteItem<TaskStats>(taskId, {
        isLoading: true,
      });
    },
    statsLoaded: (state, action: PayloadAction<[number, TaskStats]>) => {
      const [taskId, stats] = action.payload;
      state.statsById[taskId].data = stats;
      state.statsById[taskId].isLoading = false;
      state.statsById[taskId].loaded = new Date().toISOString();
    },
    taskLoad: (state, action: PayloadAction<number>) => {
      const taskId = action.payload;
      const item = state.tasksList.items.find((task) => task.id === taskId);
      state.tasksList.items = state.tasksList.items
        .filter((item) => item.id != taskId)
        .concat([remoteItem(taskId, { data: item?.data, isLoading: true })]);
    },
    taskLoaded: (state, action: PayloadAction<ZetkinTask>) => {
      const task = action.payload;
      const item = state.tasksList.items.find((item) => item.id == task.id);
      if (!item) {
        throw new Error('Finished loading item that never started loading');
      }

      item.data = task;
      item.isLoading = false;
      item.loaded = new Date().toISOString();
    },
    tasksLoad: (state) => {
      state.tasksList.isLoading = true;
    },
    tasksLoaded: (state, action: PayloadAction<ZetkinTask[]>) => {
      const tasks = action.payload;
      const timestamp = new Date().toISOString();
      state.tasksList = remoteList(tasks);
      state.tasksList.loaded = timestamp;
      state.tasksList.items.forEach((item) => (item.loaded = timestamp));
    },
  },
});

export default tasksSlice;
export const {
  campaignTaskIdsLoad,
  campaignTaskIdsLoaded,
  statsLoad,
  statsLoaded,
  taskLoad,
  taskLoaded,
  tasksLoad,
  tasksLoaded,
} = tasksSlice.actions;
