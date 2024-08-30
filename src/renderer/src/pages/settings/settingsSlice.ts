import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ApplicationSettings } from '../../../../types';
import { showErrorToast } from '@renderer/common/ToastManager';

export const SETTINGS_SLICE_NAME = 'settings';

// export interface ISettingsSlice extends ApplicationSettings {}

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
      saveCurrentState(state);
    },
    setInactivityTimer: (state, action: PayloadAction<number>) => {
      state.inactivityTimer = action.payload;
      saveCurrentState(state);
    },
    setRememberLastStateToggle: (state, action) => {
      state.rememberLastState = action.payload;
      saveCurrentState(state);
    },

    setDeviceStates: (state, action) => {
      state.devicesState = action.payload;
      saveCurrentState(state);
    },
  },
});

function saveCurrentState(state): void {
  try {
    const tmp = {
      inactivityTimer: state.inactivityTimer,
      inactivityToggle: state.inactivityToggle,
      rememberLastState: state.rememberLastState,
      devicesState: state.devicesState,
    } as ApplicationSettings;
    const settingsJson = JSON.stringify(tmp, null, 2);
    console.log(settingsJson);

    window.api.saveSettingsJson(settingsJson);
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
      showErrorToast(`Failed to save settings: ${e.message}`);
    }
  }
}

// Action creators are generated for each case reducer function
export const {
  toggleOn,
  toggleOff,
  setInactivityToggle,
  setInactivityTimer,
  setRememberLastStateToggle,
  setDeviceStates,
} = settingsSlice.actions;

export default settingsSlice.reducer;
