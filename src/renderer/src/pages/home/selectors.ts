import { RootState } from '@renderer/store';

export const selectActiveAudioDevices = (state: RootState) =>
  state.home.audioManager.activeAudioDevices;

export const selectDevicePlaybackStatuses = (state: RootState) =>
  state.home.audioManager.devicePlaybackStatuses;
