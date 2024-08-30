import { Tray, Menu, app, BrowserWindow } from 'electron';
import icon from '../../resources/favicon.ico?asset';

let isPlaying = false;

export function createTray(mainWindow: BrowserWindow | null): Tray {
  const tray = new Tray(icon);
  tray.setToolTip('Keep Audio Alive');
  updateTrayContextMenu(tray, mainWindow);

  tray.on('double-click', () => {
    if (mainWindow?.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow?.show();
  });

  return tray;
}

export function updateIsPlaying(status: boolean): void {
  isPlaying = status;
}

export function updateTrayContextMenu(tray: Tray, mainWindow: BrowserWindow | null): void {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click: (): void => {
        mainWindow?.show();
      },
    },
    { label: '', type: 'separator' },
    {
      label: 'Resume',
      click: (): void => {
        mainWindow?.webContents.send('resume-all');
        isPlaying = true;
      },
      enabled: !isPlaying,
    },
    {
      label: 'Pause',
      click: (): void => {
        mainWindow?.webContents.send('pause-all');
        isPlaying = false;
      },
      enabled: isPlaying,
    },
    { label: '', type: 'separator' },
    {
      label: 'Quit',
      click: (): void => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}
