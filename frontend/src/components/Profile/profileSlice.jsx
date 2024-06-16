import { createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: {},
  },
  reducers: {
    setUser: (state, action) => {
      state.profile = action.payload;
    },
  },
});

export const { setUser } = profileSlice.actions;
export default profileSlice.reducer;
