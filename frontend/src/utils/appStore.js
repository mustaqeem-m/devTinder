import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/UserSlice';
import feedReducer from './slice/FeedSlice';
import connectionReducer from './slice/connectionSlice';
import requestsReducer from './slice/requestsSlice';

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionReducer,
    requests: requestsReducer,
  },
});

export default appStore;
