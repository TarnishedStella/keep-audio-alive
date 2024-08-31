/* eslint-disable no-console */
import log from 'electron-log';

export function useElectronLog(): void {
  Object.assign(console, log.functions);
}
