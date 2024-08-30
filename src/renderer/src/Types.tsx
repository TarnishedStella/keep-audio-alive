export interface ActiveAudioDevice {
  mediaDeviceInfo: MediaDeviceInfoCustom;
}

export interface MediaDeviceInfoCustom {
  readonly deviceId: string;
  readonly groupId: string;
  readonly kind: MediaDeviceKind;
  readonly label: string;
}
