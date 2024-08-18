import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActiveAudioDevice } from '../../Types';

export const HOME_SLICE_NAME = 'home';

export enum PlaybackState {
  Playing,
  IdlePaused,
  UserPaused,
}

export interface IPlaybackStatus {
  deviceId: string;
  playbackState: PlaybackState;
}

interface AudioManager {
  selectedDevice: MediaDeviceInfo | null;
  activeAudioDevices: ActiveAudioDevice[];
  devicePlaybackStatuses: Record<string, IPlaybackStatus>;
}

export interface IHomeSlice {
  audioManager: AudioManager;
}

const initialState: IHomeSlice = {
  audioManager: { selectedDevice: null, activeAudioDevices: [], devicePlaybackStatuses: {} },
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

      delete state.audioManager.devicePlaybackStatuses[action.payload.mediaDeviceInfo.deviceId];
    },
    updatePlaybackStatus: (state, action: PayloadAction<IPlaybackStatus>) => {
      state.audioManager.devicePlaybackStatuses[action.payload.deviceId] = action.payload;
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
