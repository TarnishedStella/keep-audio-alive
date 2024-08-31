import { app, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import { ApplicationSettings } from '@common/types';
import { Logger } from '../common/Logger';

const settingsPath = path.join(app.getPath('userData'), 'settings.json');

let currentSettings: ApplicationSettings;

export function getSettingsFromMemory(): ApplicationSettings {
  return currentSettings;
}

export function loadSettings(): ApplicationSettings {
  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf-8');
      currentSettings = JSON.parse(data);
      return currentSettings;
    }
    const defaultSettings: ApplicationSettings = {
      inactivityToggle: true,
      inactivityTimer: 15,
      rememberLastState: true,
      devicesState: {},
    };
    saveSettings(defaultSettings);
    return defaultSettings;
  } catch (error) {
    Logger.error('Failed to load settings:', error);
    throw error;
  }
}

export function saveSettings(settings: ApplicationSettings): void {
  Logger.debug(settings);
  currentSettings = settings;
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } catch (error) {
    Logger.error('Failed to save settings:', error);
  }
}

export function saveSettingsJson(settingsJson: string): void {
  Logger.debug(settingsJson);
  currentSettings = JSON.parse(settingsJson);
  try {
    fs.writeFileSync(settingsPath, settingsJson);
  } catch (error) {
    Logger.error('Failed to save settings:', error);
  }
}

export function registerSettingsHandlers(): void {
  ipcMain.handle('load-settings', () => loadSettings());
  ipcMain.handle('save-settings', (_event, settingsData) => {
    saveSettings(settingsData);
  });
  ipcMain.handle('save-settings-json', (_event, settingsData) => {
    saveSettingsJson(settingsData);
  });
}
