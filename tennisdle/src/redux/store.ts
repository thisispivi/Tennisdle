import { configureStore } from "@reduxjs/toolkit";
import { dailyAtpSlice } from "./slices/daily";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, dailyAtpSlice.reducer);

export const store = configureStore({
  reducer: {
    dailyAtp: persistedReducer,
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
