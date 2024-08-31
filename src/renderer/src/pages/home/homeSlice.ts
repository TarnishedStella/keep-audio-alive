import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActiveAudioDevice } from '@renderer/types';
import { IPlaybackStatus, PlaybackState } from '@common/types';
import { Logger } from '@common/Logger';

export const HOME_SLICE_NAME = 'home';

interface AudioManager {
  selectedDevice: MediaDeviceInfo | null;
  activeAudioDevices: ActiveAudioDevice[];
  devicePlaybackStatuses: Record<string, IPlaybackStatus>;
  initialized: boolean;
}

export interface IHomeSlice {
  audioManager: AudioManager;
}

const initialState: IHomeSlice = {
  audioManager: {
    selectedDevice: null,
    activeAudioDevices: [],
    devicePlaybackStatuses: {},
    initialized: false,
  },
};

export const homeSlice = createSlice({
  name: HOME_SLICE_NAME,
  initialState,
  reducers: {
    setSelectedDevice: (state, action: PayloadAction<MediaDeviceInfo | null>) => {
      state.audioManager.selectedDevice = action.payload;
    },
    addActiveAudioDevice: (state, action: PayloadAction<ActiveAudioDevice>) => {
      Logger.info(`adding active audio device`, action.payload.mediaDeviceInfo);
      state.audioManager.activeAudioDevices.push(action.payload);
    },
    removeActiveAudioDevice: (state, action: PayloadAction<ActiveAudioDevice>) => {
      Logger.info(`removing active audio device: ${action.payload.mediaDeviceInfo}`);
      Logger.debug(action.payload);

      state.audioManager.activeAudioDevices = state.audioManager.activeAudioDevices.filter(
        (device) => device.mediaDeviceInfo.deviceId !== action.payload.mediaDeviceInfo.deviceId,
      );

      delete state.audioManager.devicePlaybackStatuses[action.payload.mediaDeviceInfo.deviceId];
    },
    updatePlaybackStatus: (state, action: PayloadAction<IPlaybackStatus>) => {
      Logger.info(
        `updating playback status: ${action.payload.deviceDetails.label} -- ${action.payload.playbackState}`,
      );
      state.audioManager.devicePlaybackStatuses[action.payload.deviceDetails.deviceId] =
        action.payload;

      if (state.audioManager.activeAudioDevices.length > 0) {
        // if anything is playing, send a message to the main process ot update the tray icon
        const isPlaying = state.audioManager.activeAudioDevices.some((device) => {
          const playbackStatus =
            state.audioManager.devicePlaybackStatuses[device.mediaDeviceInfo.deviceId];
          return playbackStatus?.playbackState === PlaybackState.Playing;
        });

        if (isPlaying) {
          Logger.debug('application is currently playing audio');
          window.api.playingAudio();
        } else {
          Logger.debug('application is not currently playing any audio');
          window.api.notPlayingAudio();
        }
      }
    },
    setInitialized: (state) => {
      Logger.debug('initialized application');
      state.audioManager.initialized = true;
    },
  },
});

export const {
  setSelectedDevice,
  addActiveAudioDevice,
  removeActiveAudioDevice,
  updatePlaybackStatus,
  setInitialized,
} = homeSlice.actions;

export default homeSlice.reducer;
