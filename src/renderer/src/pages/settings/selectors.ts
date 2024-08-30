import { RootState } from '@renderer/store';

export const selectIsInactivityToggled = (state: RootState) => state.settings.inactivityToggle;

export const selectInactivityTimer = (state: RootState) => state.settings.inactivityTimer;

export const selectIsRememberLastStateToggled = (state: RootState) =>
  state.settings.rememberLastState;

export const selectDevicesState = (state: RootState) => state.settings.devicesState;
