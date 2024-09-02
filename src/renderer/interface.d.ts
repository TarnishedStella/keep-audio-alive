import { ApplicationSettings } from 'src/types';

export interface IElectronAPI {
  getAppVersion: () => Promise<string>;
  getSettings: () => Promise<ApplicationSettings>;
  saveSettings: (settings: ApplicationSettings) => Promise<void>;
  saveSettingsJson: (settingsJson: string) => Promise<void>;
  on: (channel: string, listener: (...args: never[]) => void) => () => Electron.IpcRenderer;
  playingAudio: () => Promise<void>;
  notPlayingAudio: () => Promise<void>;
  downloadUpdate: () => Promise<void>;
}

declare global {
  interface Window {
    api: IElectronAPI;
  }
}
