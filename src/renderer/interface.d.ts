import { ApplicationSettings } from 'src/types';

export interface IElectronAPI {
  getAppVersion: () => Promise<string>;
  getSettings: () => Promise<ApplicationSettings>;
  saveSettings: (settings: ApplicationSettings) => Promise<void>;
  on: (channel: string, listener: (...args: unknown[]) => void) => () => Electron.IpcRenderer;
}

declare global {
  interface Window {
    api: IElectronAPI;
  }
}
