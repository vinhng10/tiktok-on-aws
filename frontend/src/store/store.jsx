import { combineReducers, configureStore } from "@reduxjs/toolkit";
import appReducer from "../components/App/appSlice";
import profileReducer from "../components/Profile/profileSlice";
import storage from "redux-persist/lib/storage";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";

// Combine your reducers
const rootReducer = combineReducers({
  app: appReducer,
  profile: profileReducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
