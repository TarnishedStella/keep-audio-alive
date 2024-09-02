import { app, BrowserWindow, ipcMain, Tray } from 'electron';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import { createMainWindow } from './components/windowManager';
import { createTray, updateIsPlaying, updateTrayContextMenu } from './components/tray';
import { registerSettingsHandlers } from './components/settings';
import { startMonitoring } from './components/inactivity';
import { setupLogging } from './components/logging';
import { ConfigureAutomaticUpdates } from './components/automaticUpdates';
import { Channels } from '../common/ipc';

const log = require('electron-log');

const UPDATE_CHECK_INTERVAL = 1000 * 60 * 60 * 12; // 1 sec -> 1 min -> 1 hr -> 12 hrs

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;

setupLogging();
log.info('Starting application');

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.tarnishedstella.keepaudioalive');

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
  ConfigureAutomaticUpdates(mainWindow, UPDATE_CHECK_INTERVAL);
});

app.on('before-quit', () => {
  isQuitting = true;
  log.info('Quitting');
});

app.on('window-all-closed', (event) => {
  event.preventDefault();
});

ipcMain.handle(Channels.PLAYING_AUDIO, (event) => {
  event.preventDefault();
  updateIsPlaying(true);
  updateTrayContextMenu(tray!, mainWindow);
});

ipcMain.handle(Channels.NOT_PLAYING_AUDIO, (event) => {
  event.preventDefault();
  updateIsPlaying(false);
  updateTrayContextMenu(tray!, mainWindow);
});

ipcMain.handle(Channels.GET_APP_VERSION, async () => {
  return app.getVersion();
});
