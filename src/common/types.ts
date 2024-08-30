export interface ApplicationSettings {
  inactivityToggle: boolean;
  inactivityTimer: number;
  rememberLastState: boolean;
  devicesState: Record<string, IPlaybackStatus>;
}

export interface MediaDeviceInfoCustom {
  readonly deviceId: string;
  readonly groupId: string;
  readonly kind: MediaDeviceKind;
  readonly label: string;
}

export enum PlaybackState {
  Playing,
  IdlePaused,
  UserPaused,
}

export interface IPlaybackStatus {
  deviceDetails: MediaDeviceInfoCustom;
  playbackState: PlaybackState;
}
