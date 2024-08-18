export interface IElectronAPI {
  getAppVersion: () => Promise<void>,
}

declare global {
  interface Window {
    api: IElectronAPI
  }
}
