export interface ActiveAudioDevice {
  mediaDeviceInfo: MediaDeviceInfoCustom;

  // htmlAudioElement: HTMLAudioElement;
  //htmlAudioElement: React.RefObject<HTMLAudioElement>;
}

export interface MediaDeviceInfoCustom {
  readonly deviceId: string;
  readonly groupId: string;
  readonly kind: MediaDeviceKind;
  readonly label: string;
}
