import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { ApplicationSettings } from '@common/types';
import { Logger } from '../common/Logger';
import { Channels } from '../common/ipc';

// Custom APIs for renderer
const api = {
  getAppVersion: (): Promise<string> => ipcRenderer.invoke(Channels.GET_APP_VERSION),
  getSettings: (): Promise<ApplicationSettings> => ipcRenderer.invoke(Channels.LOAD_SETTINGS),
  saveSettings: (settingsData: ApplicationSettings): Promise<void> =>
    ipcRenderer.invoke(Channels.SAVE_SETTINGS, settingsData),
  saveSettingsJson: (settingsJson: string): Promise<void> =>
    ipcRenderer.invoke(Channels.SAVE_SETTINGS_JSON, settingsJson),
  playingAudio: (): Promise<void> => ipcRenderer.invoke(Channels.PLAYING_AUDIO),
  notPlayingAudio: (): Promise<void> => ipcRenderer.invoke(Channels.NOT_PLAYING_AUDIO),
  on: (channel: string, listener: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, listener);
    return (): Electron.IpcRenderer => ipcRenderer.removeListener(channel, listener);
  },
  downloadUpdate: (): Promise<void> => ipcRenderer.invoke(Channels.UPDATE_DOWNLOAD_EVENT),
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
