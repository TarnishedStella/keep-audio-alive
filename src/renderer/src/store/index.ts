import { configureStore } from '@reduxjs/toolkit';

import settingsReducer, { SETTINGS_SLICE_NAME } from '../pages/settings/settingsSlice'
import audioReducer, { HOME_SLICE_NAME } from '../pages/home/homeSlice';

const store = configureStore({
  reducer: {
    [SETTINGS_SLICE_NAME]: settingsReducer,
    [HOME_SLICE_NAME]: audioReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;
