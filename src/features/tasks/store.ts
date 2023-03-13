import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinTask } from './components/types';
import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';

export interface TasksStoreSlice {
  tasksList: RemoteList<ZetkinTask>;
}

const initialState: TasksStoreSlice = {
  tasksList: remoteList(),
};

const tasksSlice = createSlice({
  initialState,
  name: 'tasks',
  reducers: {
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
    },
  },
});

export default tasksSlice;
export const { taskLoad, taskLoaded, tasksLoad, tasksLoaded } =
  tasksSlice.actions;
