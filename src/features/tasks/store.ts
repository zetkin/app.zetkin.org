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
  tasksList: RemoteList<ZetkinTask>;
}

const initialState: TasksStoreSlice = {
  statsById: {},
  tasksList: remoteList(),
};

const tasksSlice = createSlice({
  initialState,
  name: 'tasks',
  reducers: {
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
  statsLoad,
  statsLoaded,
  taskCreate,
  taskCreated,
  taskDeleted,
  taskLoad,
  taskLoaded,
  tasksLoad,
  tasksLoaded,
} = tasksSlice.actions;
