/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { RootState } from '@renderer/store';

export const selectActiveAudioDevices = (state: RootState) =>
  state.home.audioManager.activeAudioDevices;

export const selectDevicePlaybackStatuses = (state: RootState) =>
  state.home.audioManager.devicePlaybackStatuses;

export const selectIsInitialized = (state: RootState) => state.home.audioManager.initialized;
