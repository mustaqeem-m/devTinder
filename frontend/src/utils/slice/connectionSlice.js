import { createSlice } from '@reduxjs/toolkit';

const connectionsSlice = createSlice({
  name: 'connections',
  initialState: null,
  reducers: {
    addConnections: (state, action) => {
      return action.payload;
    },
    removeConnections: (state, action) => null,
  },
});

export default connectionsSlice.reducer;
export const { addConnections, removeConnections } = connectionsSlice.actions;
