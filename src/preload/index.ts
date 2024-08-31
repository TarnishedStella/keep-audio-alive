import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { ApplicationSettings } from '@common/types';
import { Logger } from '../common/Logger';

// Custom APIs for renderer
const api = {
  getAppVersion: (): Promise<string> => ipcRenderer.invoke('get-app-version'),
  getSettings: (): Promise<ApplicationSettings> => ipcRenderer.invoke('load-settings'),
  saveSettings: (settingsData: ApplicationSettings): Promise<void> =>
    ipcRenderer.invoke('save-settings', settingsData),
  saveSettingsJson: (settingsJson: string): Promise<void> =>
    ipcRenderer.invoke('save-settings-json', settingsJson),
  playingAudio: (): Promise<void> => ipcRenderer.invoke('playing-audio'),
  notPlayingAudio: (): Promise<void> => ipcRenderer.invoke('not-playing-audio'),
  on: (channel: string, listener: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, listener);
    return (): Electron.IpcRenderer => ipcRenderer.removeListener(channel, listener);
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    Logger.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
