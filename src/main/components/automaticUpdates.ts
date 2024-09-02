import { join } from 'path';
import { autoUpdater, ProgressInfo, UpdateDownloadedEvent, UpdateInfo } from 'electron-updater';
import { BrowserWindow, ipcMain } from 'electron';
import { AutoUpdaterChannels, Channels } from '../../common/ipc';
const log = require('electron-log');

// Force update check in development mode

export function ConfigureAutomaticUpdates(window: BrowserWindow, checkIntervalMs: number): void {
  if (process.env.NODE_ENV === 'development') {
    autoUpdater.forceDevUpdateConfig = true;
    autoUpdater.updateConfigPath = join(__dirname, 'dev-app-update.yml');
  }
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.autoRunAppAfterInstall = true;

  log.transports.file.level = 'debug';
  autoUpdater.logger = log;

  RegisterIpcEvents(window);

  autoUpdater.checkForUpdatesAndNotify();
  setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, checkIntervalMs);
}

function RegisterIpcEvents(window: BrowserWindow): void {
  autoUpdater.on(AutoUpdaterChannels.CHECKING_FOR_UPDATE, () => {
    window?.webContents.send('update-checking');
  });

  autoUpdater.on(AutoUpdaterChannels.DOWNLOAD_PROGRESS, (progressInfo: ProgressInfo) => {
    window?.webContents.send('update-download-progress', progressInfo);
  });

  autoUpdater.on(AutoUpdaterChannels.UPDATE_ERROR, (error: Error) => {
    window?.webContents.send('update-error', 'Error in auto-updater. ' + error);
  });

  autoUpdater.on(AutoUpdaterChannels.UPDATE_AVAILABLE, (info: UpdateInfo) => {
    log.info('Update available:', info);
    window?.webContents.send('update-available', info);
  });

  autoUpdater.on(AutoUpdaterChannels.UPDATE_DOWNLOADED, (info: UpdateDownloadedEvent) => {
    log.info('Update downloaded:', info);
    window?.webContents.send('update-downloaded');
    if (process.env.NODE_ENV === 'development') {
      // do nothing in dev
      return;
    }

    autoUpdater.quitAndInstall(false, true);
  });

  ipcMain.handle(Channels.UPDATE_DOWNLOAD_EVENT, (event) => {
    console.log(event);
    autoUpdater.downloadUpdate();
  });
}
