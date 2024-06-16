import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    user: null,
    page: "auth",
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const { setUser, setPage } = appSlice.actions;
export default appSlice.reducer;
