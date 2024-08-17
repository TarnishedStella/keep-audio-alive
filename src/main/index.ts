import { app, shell, BrowserWindow, ipcMain, Tray, Menu } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';

import audio from '../../resources/nothing.mp3?asset';


let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let audioWindow: BrowserWindow | null = null;
let isQuitting: boolean;
let isPlaying = false;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
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

const createAudioWindow = () => {
  audioWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  audioWindow.loadFile('./resources/hidden-audio.html');
};

const createTray = () => {
  tray = new Tray(icon); // Replace with the path to your tray icon
  tray.setToolTip('Keep Audio Alive');
  UpdateTrayContextMenu();
};

const UpdateTrayContextMenu = () => {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Start',
      click: () => {
        audioWindow?.webContents.send('audio-control', { action: 'play', src: audio, loop: true });
      },
      enabled: !isPlaying,
    },
    {
      label: 'Stop',
      click: () => {
        audioWindow?.webContents.send('audio-control', { action: 'stop' });
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

  // IPC test
  ipcMain.on('ping', () => console.log('pong'));

  createWindow();
  createTray();
  createAudioWindow();

  console.log(audio);

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
});

app.on('window-all-closed', (event) => {
  event.preventDefault(); // Prevent the app from quitting when the window is closed
});

app.on('before-quit', () => {
  isQuitting = true;
});

ipcMain.on('audio-status', (event, status) => {
  isPlaying = status === 'playing';
  UpdateTrayContextMenu();
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
