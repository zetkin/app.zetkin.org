import { configureStore } from '@reduxjs/toolkit';

import tagsReducer from 'features/tags/store';

export const store = configureStore({
    reducer: {
        tags: tagsReducer,
    }
})


export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;