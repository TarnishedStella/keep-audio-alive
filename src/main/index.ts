import { app, BrowserWindow, ipcMain, Tray } from 'electron';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import { createMainWindow } from './windows';
import { createTray, updateIsPlaying, updateTrayContextMenu } from './tray';
import { registerSettingsHandlers } from './settings';
import { startMonitoring } from './inactivity';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;

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
});

app.on('before-quit', () => {
  isQuitting = true;
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
