import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../components/App/appSlice";
import profileReducer from "../components/Profile/profileSlice";

const store = configureStore({
  reducer: {
    app: appReducer,
    profile: profileReducer,
  },
});

export default store;
