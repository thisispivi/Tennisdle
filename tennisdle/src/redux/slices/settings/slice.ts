import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  locale: string;
}

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    locale: "en",
  } as SettingsState,
  reducers: {
    setLocale: (state, action: PayloadAction<string>) => {
      state.locale = action.payload;
    },
  },
});

export const { setLocale } = settingsSlice.actions;
