import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const refreshFeedWithDelay = createAsyncThunk(
  'feed/refreshFeedWithDelay',
  async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return userId;
  }
);

const FeedSlice = createSlice({
  name: 'feed',
  initialState: [],
  reducers: {
    addFeed: (state, action) => action.payload,
    clearFeed: (state, action) => null,
  },
  extraReducers: (builder) => {
    builder.addCase(refreshFeedWithDelay.fulfilled, (state, action) => {
      const refreshedFeed = state.filter((f) => f._id !== action.payload);
      return refreshedFeed;
    });
  },
});

export default FeedSlice.reducer;
export const { addFeed, clearFeed } = FeedSlice.actions;
