/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { RootState } from '@renderer/store';
import { IPlaybackStatus } from 'src/common/types';

export const selectIsInactivityToggled = (state: RootState) => state.settings.inactivityToggle;

export const selectInactivityTimer = (state: RootState) => state.settings.inactivityTimer;

export const selectIsRememberLastStateToggled = (state: RootState) =>
  state.settings.rememberLastState;

export const selectDevicesState = (state: RootState): Record<string, IPlaybackStatus> =>
  state.settings.devicesState;

export const selectIsLaunchOnStartupToggled = (state: RootState) => state.settings.launchOnStartup;

export const selectIsLaunchHiddenToggled = (state: RootState) => state.settings.launchHidden;
