import { createSlice } from '@reduxjs/toolkit';

const FeedSlice = createSlice({
  name: 'feed',
  initialState: null,
  reducers: {
    addFeed: (state, action) => action.payload,
    clearFeed: (state, action) => null,
  },
});

export default FeedSlice.reducer;
export const { addFeed, clearFeed } = FeedSlice.actions;
