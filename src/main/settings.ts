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
        rememberLastState: true,
        devicesState: {},
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
  console.log(settings);
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

export function saveSettingsJson(settingsJson: string): void {
  console.log(settingsJson);
  try {
    fs.writeFileSync(settingsPath, settingsJson);
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

export function registerSettingsHandlers(): void {
  ipcMain.handle('load-settings', () => loadSettings());
  ipcMain.handle('save-settings', (event, settingsData) => {
    saveSettings(settingsData);
  });
  ipcMain.handle('save-settings-json', (event, settingsData) => {
    saveSettingsJson(settingsData);
  });
}
