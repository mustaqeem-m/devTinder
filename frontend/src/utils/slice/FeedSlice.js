import { createSlice } from '@reduxjs/toolkit';

const FeedSlice = createSlice({
  name: 'feed',
  initialState: null,
  reducers: {
    addFeed: (state, action) => action.payload,
    clearFeed: (state, action) => null,
    refreshFeed: (state, action) => {
      const refreshedFeed = state.filter((f) => f._id !== action.payload);
      return refreshedFeed;
    },
  },
});

export default FeedSlice.reducer;
export const { addFeed, clearFeed, refreshFeed } = FeedSlice.actions;
