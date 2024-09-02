import { app, BrowserWindow, dialog, ipcMain, Tray } from 'electron';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import { createMainWindow } from './windows';
import { createTray, updateIsPlaying, updateTrayContextMenu } from './tray';
import { registerSettingsHandlers } from './settings';
import { startMonitoring } from './inactivity';
import { setupLogging } from './logging';
import { join } from 'path';

// const { autoUpdater, AppUpdater } = require("electron-updater");

import { autoUpdater } from 'electron-updater';
const log = require('electron-log');

// Force update check in development mode
if (process.env.NODE_ENV === 'development') {
  autoUpdater.updateConfigPath = join(__dirname, 'dev-app-update.yml');
}

// if (isDev) {
//   // Useful for some dev/debugging tasks, but download can
//   // not be validated becuase dev app is not signed
//   autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml');
// }

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.autoRunAppAfterInstall = true;

// autoUpdater.checkForUpdates();

log.transports.file.level = 'debug';
autoUpdater.logger = log;

// autoUpdater.on('checking-for-update', () => {
//   sendStatusToWindow('Checking for update...');
// });
// // autoUpdater.on('update-available', (info) => {
// //   sendStatusToWindow('Update available.');
// //   console.log(info);
// // });
// autoUpdater.on('update-not-available', (info) => {
//   sendStatusToWindow('Update not available.');
//   console.log(info);
// });
// autoUpdater.on('error', (err) => {
//   sendStatusToWindow('Error in auto-updater. ' + err);
// });
// autoUpdater.on('download-progress', (progressObj) => {
//   let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
//   log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
//   log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
//   sendStatusToWindow(log_message);
// });
// autoUpdater.on('update-downloaded', (info) => {
//   sendStatusToWindow('Update downloaded');
//   console.log(info);
// });

// Event listeners for the update process
autoUpdater.on('update-available', (info) => {
  log.info('Update available:', info);
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: 'A new update is available. Downloading now...',
  });
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded:', info);
  dialog
    .showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: 'An update has been downloaded. Would you like to install it now?',
      buttons: ['Yes', 'Later'],
    })
    .then((result) => {
      const buttonIndex = result.response;

      if (buttonIndex === 0) {
        autoUpdater.quitAndInstall(false, true);
      }
    });
});

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;

setupLogging();
log.info('Starting application');

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  mainWindow = createMainWindow();
  tray = createTray(mainWindow);

  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow?.hide();
  });

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) mainWindow = createMainWindow();
  });

  startMonitoring(mainWindow);

  registerSettingsHandlers();

  // Check for updates after the main window is created
  autoUpdater.forceDevUpdateConfig = true;
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('before-quit', () => {
  isQuitting = true;
  log.info('Quitting');
});

app.on('window-all-closed', (event) => {
  event.preventDefault();
});

ipcMain.handle('playing-audio', (event) => {
  event.preventDefault();
  updateIsPlaying(true);
  updateTrayContextMenu(tray!, mainWindow);
});

ipcMain.handle('not-playing-audio', (event) => {
  event.preventDefault();
  updateIsPlaying(false);
  updateTrayContextMenu(tray!, mainWindow);
});

ipcMain.handle('get-app-version', async () => {
  return app.getVersion();
});

function sendStatusToWindow(arg0: string): void {
  console.log(arg0);
}
