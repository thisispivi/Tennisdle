import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/es/storage";

import { dailySlice } from "./slices/daily/slice";
import { gridSlice } from "./slices/grid/slice";
import { imageSlice } from "./slices/image/slice";
import { settingsSlice } from "./slices/settings/slice";
import { top10Slice } from "./slices/top10/slice";
import { unlimitedSlice } from "./slices/unlimited/slice";
import { venueSlice } from "./slices/venue/slice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedDaily = persistReducer(persistConfig, dailySlice.reducer);
const persistedUnlimted = persistReducer(persistConfig, unlimitedSlice.reducer);
const persistedImage = persistReducer(
  { key: "image", storage },
  imageSlice.reducer
);
const persistedVenue = persistReducer(
  { key: "venue", storage },
  venueSlice.reducer
);
const persistedTop10 = persistReducer(
  { key: "top10", storage },
  top10Slice.reducer
);
const persistedGrid = persistReducer(
  { key: "grid", storage },
  gridSlice.reducer
);
const persistedSettings = persistReducer(
  { key: "settings", storage },
  settingsSlice.reducer
);

export const store = configureStore({
  reducer: {
    daily: persistedDaily,
    unlimited: persistedUnlimted,
    image: persistedImage,
    venue: persistedVenue,
    top10: persistedTop10,
    grid: persistedGrid,
    settings: persistedSettings,
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
