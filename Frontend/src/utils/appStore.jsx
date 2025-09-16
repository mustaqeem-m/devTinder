import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './slice/UserSlice';

const appStore = configureStore({
  reducer: {
    user: UserSlice,
  },
});

export default appStore;
