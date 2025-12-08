import { ElectronAPI } from '@electron-toolkit/preload';
import { ApplicationSettings } from '@common/types';

interface API {
  getAppVersion: () => Promise<string>;
  getSettings: () => Promise<ApplicationSettings>;
  saveSettings: (settingsData: ApplicationSettings) => Promise<void>;
  saveSettingsJson: (settingsJson: string) => Promise<void>;
  playingAudio: () => Promise<void>;
  notPlayingAudio: () => Promise<void>;
  getAutoLaunchEnabled: () => Promise<boolean>;
  getLoginItemSettings: () => Promise<Electron.LoginItemSettings>;
  on: (channel: string, listener: (...args: unknown[]) => void) => () => Electron.IpcRenderer;
  downloadUpdate: () => Promise<void>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: API;
  }
}
