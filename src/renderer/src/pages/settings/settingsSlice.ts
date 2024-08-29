import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// import {ApplicationSettings} from '../../../../main/types';

export const SETTINGS_SLICE_NAME = 'settings';

export interface ISettingsSlice {
  inactivityToggle: boolean;
  inactivityTimer: number;
}

const loadedSettings = await window.api.getSettings();
console.log(loadedSettings);

export const settingsSlice = createSlice({
  name: SETTINGS_SLICE_NAME,
  initialState: loadedSettings,
  reducers: {
    toggleOn: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.inactivityToggle = true;
    },
    toggleOff: (state) => {
      state.inactivityToggle = false;
    },
    setInactivityToggle: (state, action) => {
      state.inactivityToggle = action.payload;
      window.api.saveSettings({
        inactivityTimer: state.inactivityTimer,
        inactivityToggle: state.inactivityToggle,
      } as ISettingsSlice);
    },
    setInactivityTimer: (state, action: PayloadAction<number>) => {
      state.inactivityTimer = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleOn, toggleOff, setInactivityToggle, setInactivityTimer } =
  settingsSlice.actions;

export default settingsSlice.reducer;
