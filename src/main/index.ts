import { app, shell, BrowserWindow, ipcMain, Tray, Menu, powerMonitor } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';

import { ApplicationSettings } from './types';

const fs = require('fs');
const path = require('path');

const settingsPath = path.join(app.getPath('userData'), 'settings.json');

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting: boolean;
let isPlaying = false;
const settings = loadSettings();

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minHeight: 400,
    minWidth: 650,
    show: false,
    autoHideMenuBar: true,
    title: 'Keep Audio Alive',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

const createTray = () => {
  tray = new Tray(icon); // Replace with the path to your tray icon
  tray.setToolTip('Keep Audio Alive');
  UpdateTrayContextMenu();
};

const UpdateTrayContextMenu = () => {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Resume',
      click: () => {
        mainWindow?.webContents.send('resume-all');
        isPlaying = true;
      },
      enabled: !isPlaying,
    },
    {
      label: 'Pause',
      click: () => {
        mainWindow?.webContents.send('pause-all');
        isPlaying = false;
      },
      enabled: isPlaying,
    },
    { label: '', type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray?.setContextMenu(contextMenu);
};

const showMainWindow = () => {
  if (mainWindow!.isMinimized()) {
    mainWindow!.restore();
  }
  mainWindow!.show();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();
  createTray();

  mainWindow?.on('minimize', (event) => {
    event.preventDefault();
    mainWindow?.hide();
  });

  mainWindow?.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
    return false;
  });

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  tray!.on('double-click', () => {
    showMainWindow();
  });

  startMonitoring();
});

app.on('window-all-closed', (event) => {
  event.preventDefault(); // Prevent the app from quitting when the window is closed
});

app.on('before-quit', () => {
  isQuitting = true;
});

ipcMain.handle('playing-audio', (event) => {
  isPlaying = true;
  UpdateTrayContextMenu();
});

ipcMain.handle('not-playing-audio', (event) => {
  isPlaying = false;
  UpdateTrayContextMenu();
});

ipcMain.handle('get-app-version', async () => {
  return app.getVersion();
});

function loadSettings(): ApplicationSettings {
  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf-8');
      return JSON.parse(data);
    } else {
      // create default settings
      console.log('creating default settings');
      const defaultSettings: ApplicationSettings = {
        inactivityToggle: true,
        inactivityTimer: 15,
      };
      saveSettings(defaultSettings);
      return defaultSettings;
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
    throw error;
  }
}

ipcMain.handle('load-settings', () => {
  return loadSettings();
});

ipcMain.handle('save-settings', (event, settingsData) => {
  saveSettings(settingsData);
});

// Function to write settings to the file
function saveSettings(settings: ApplicationSettings): void {
  try {
    console.log(JSON.stringify(settings, null, 2));
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

const INACTIVITY_THRESHOLD = 5; // 1 minute
const CHECK_INTERVAL = 1000; // 10 seconds

async function monitorInactivity() {
  let wasPreviouslyIdle: boolean = false;
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, CHECK_INTERVAL));

    const isNowIdle = checkUserInactivity();

    if (isNowIdle && !wasPreviouslyIdle) {
      console.log('user is idle!');
      mainWindow!.webContents.send('user-inactive');
      wasPreviouslyIdle = true;
    }

    if (wasPreviouslyIdle && !isNowIdle) {
      wasPreviouslyIdle = false;
      mainWindow!.webContents.send('user-active');
    }
  }
}

function checkUserInactivity(): boolean {
  const idleTime = powerMonitor.getSystemIdleTime();
  console.log(idleTime);
  if (idleTime > INACTIVITY_THRESHOLD) {
    return true;
  }
  return false;
}

function startMonitoring() {
  monitorInactivity().catch(console.error);
}

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
