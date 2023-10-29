import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TaskStats } from './rpc/getTaskStats';
import {
  RemoteItem,
  remoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import { ZetkinAssignedTask, ZetkinTask } from './components/types';

export interface TasksStoreSlice {
  assignedTasksByTaskId: Record<number, RemoteList<ZetkinAssignedTask>>;
  statsById: Record<number, RemoteItem<TaskStats>>;
  taskIdsByCampaignId: Record<number, RemoteList<{ id: string | number }>>;
  tasksList: RemoteList<ZetkinTask>;
}

const initialState: TasksStoreSlice = {
  assignedTasksByTaskId: {},
  statsById: {},
  taskIdsByCampaignId: {},
  tasksList: remoteList(),
};

const tasksSlice = createSlice({
  initialState,
  name: 'tasks',
  reducers: {
    assignedTasksLoad: (state, action: PayloadAction<number>) => {
      const assignedTaskId = action.payload;
      if (!state.assignedTasksByTaskId[assignedTaskId]) {
        state.assignedTasksByTaskId[assignedTaskId] = remoteList();
      }
      state.assignedTasksByTaskId[assignedTaskId].isLoading = true;
    },
    assignedTasksLoaded: (
      state,
      action: PayloadAction<[number, ZetkinAssignedTask[]]>
    ) => {
      const [assignedTaskId, assignedTask] = action.payload;
      state.assignedTasksByTaskId[assignedTaskId] = remoteList(assignedTask);
      state.assignedTasksByTaskId[assignedTaskId].loaded =
        new Date().toISOString();
    },
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
    taskCreate: (state) => {
      state.tasksList.isLoading;
    },
    taskCreated: (state, action: PayloadAction<ZetkinTask>) => {
      const task = action.payload;
      state.tasksList.isLoading = false;
      state.tasksList.items.push(remoteItem(task.id, { data: task }));
    },
    taskDeleted: (state, action: PayloadAction<number>) => {
      const taskId = action.payload;
      state.tasksList.items = state.tasksList.items.filter(
        (item) => item.id != taskId
      );
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
    taskUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [taskId, mutating] = action.payload;
      const item = state.tasksList.items.find((item) => item.id == taskId);
      if (item) {
        item.mutating = mutating;
      }
    },
    taskUpdated: (state, action: PayloadAction<ZetkinTask>) => {
      const task = action.payload;
      const item = state.tasksList.items.find((item) => item.id == task.id);
      if (item) {
        item.data = { ...item.data, ...task };
        item.mutating = [];
      }
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
  assignedTasksLoad,
  assignedTasksLoaded,
  campaignTaskIdsLoad,
  campaignTaskIdsLoaded,
  statsLoad,
  statsLoaded,
  taskCreate,
  taskCreated,
  taskDeleted,
  taskLoad,
  taskLoaded,
  taskUpdate,
  taskUpdated,
  tasksLoad,
  tasksLoaded,
} = tasksSlice.actions;
