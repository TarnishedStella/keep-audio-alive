import { app, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import { ApplicationSettings } from '../types';

const settingsPath = path.join(app.getPath('userData'), 'settings.json');

export function loadSettings(): ApplicationSettings {
  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf-8');
      return JSON.parse(data);
    } else {
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

export function saveSettings(settings: ApplicationSettings): void {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

export function registerSettingsHandlers(): void {
  ipcMain.handle('load-settings', () => loadSettings());
  ipcMain.handle('save-settings', (event, settingsData) => {
    saveSettings(settingsData);
  });
}
