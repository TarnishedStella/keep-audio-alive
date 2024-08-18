import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActiveAudioDevice } from '../../Types';

// import {ApplicationSettings} from '../../../../main/types';

export const HOME_SLICE_NAME = 'home';

export interface IPlaybackStatus{
  deviceId: string;
  isPaused: boolean;
  userPaused: boolean;
}

interface AudioManager {
  selectedDevice: MediaDeviceInfo | null;
  activeAudioDevices: ActiveAudioDevice[];
  playbackStatus: Record<string, IPlaybackStatus>;
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
        (device) => device.mediaDeviceInfo.deviceId !== action.payload.mediaDeviceInfo.deviceId,
      );

      delete state.audioManager.playbackStatus[action.payload.mediaDeviceInfo.deviceId];
      // const { [action.payload.mediaDeviceInfo.deviceId]: _, ...newPlaybackStatus } = state.audioManager.playbackStatus;
      // state.audioManager.playbackStatus = newPlaybackStatus;
    },
    updatePlaybackStatus: (
      state,
      action: PayloadAction<IPlaybackStatus>,
    ) => {
      state.audioManager.playbackStatus[action.payload.deviceId] = action.payload;
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
