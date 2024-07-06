import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    user: null,
    page: "auth",
    activeId: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setActiveId: (state, action) => {
      state.activeId = action.payload;
    },
  },
});

export const { setUser, setPage, setActiveId } = appSlice.actions;
export default appSlice.reducer;
