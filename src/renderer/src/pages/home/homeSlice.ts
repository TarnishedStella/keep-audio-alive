import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActiveAudioDevice } from '../../Types';

// import {ApplicationSettings} from '../../../../main/types';

export const HOME_SLICE_NAME = 'home';

interface AudioManager {
  selectedDevice: MediaDeviceInfo | null;
  activeAudioDevices: ActiveAudioDevice[];
  playbackStatus: Record<string, boolean>;
}

export interface IHomeSlice {
  audioManager: AudioManager;
}

const initialState: IHomeSlice = {
  audioManager: { selectedDevice: null, activeAudioDevices: [], playbackStatus: {} },
};

export const homeSlice = createSlice({
  name: HOME_SLICE_NAME,
  initialState: initialState,
  reducers: {
    setSelectedDevice: (state, action: PayloadAction<MediaDeviceInfo | null>) => {
      state.audioManager.selectedDevice = action.payload;
    },
    addActiveAudioDevice: (state, action: PayloadAction<ActiveAudioDevice>) => {
      state.audioManager.activeAudioDevices.push(action.payload);
    },
    removeActiveAudioDevice: (state, action: PayloadAction<ActiveAudioDevice>) => {
      console.log(action.payload);

      state.audioManager.activeAudioDevices = state.audioManager.activeAudioDevices.filter(
        (device) => device.htmlAudioElement !== action.payload.htmlAudioElement,
      );
      const { [action.payload.mediaDeviceInfo.deviceId]: _, ...newPlaybackStatus } = state.audioManager.playbackStatus;
      state.audioManager.playbackStatus = newPlaybackStatus;
    },
    updatePlaybackStatus: (
      state,
      action: PayloadAction<{ deviceId: string; isPaused: boolean }>,
    ) => {
      state.audioManager.playbackStatus[action.payload.deviceId] = action.payload.isPaused;
    },
  },
});

export const {
  setSelectedDevice,
  addActiveAudioDevice,
  removeActiveAudioDevice,
  updatePlaybackStatus,
} = homeSlice.actions;

export default homeSlice.reducer;
