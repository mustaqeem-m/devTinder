import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/UserSlice';
import feedReducer from './slice/feedSlice';

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
  },
});

export default appStore;
