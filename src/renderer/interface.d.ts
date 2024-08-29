export interface IElectronAPI {
  getAppVersion: () => Promise<void>;
  getSettings: () => Promise<ISettingsSlice>;
}

declare global {
  interface Window {
    api: IElectronAPI;
  }
}
