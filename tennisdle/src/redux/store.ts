import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { dailySlice } from "./slices/daily/slice";
import { unlimitedSlice } from "./slices/unlimited/slice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedDaily = persistReducer(persistConfig, dailySlice.reducer);
const persistedUnlimted = persistReducer(persistConfig, unlimitedSlice.reducer);

export const store = configureStore({
  reducer: {
    daily: persistedDaily,
    unlimited: persistedUnlimted,
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
