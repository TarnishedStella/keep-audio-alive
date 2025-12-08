import { app, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import { ApplicationSettings } from '@common/types';
import { Logger } from '../../common/Logger';
import { Channels } from '../../common/ipc';
import { setAutoLaunch } from './autoLaunch';

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
      launchOnStartup: false,
      launchHidden: true,
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

  // Apply auto-launch setting if it changed
  if (
    currentSettings &&
    (currentSettings.launchOnStartup !== settings.launchOnStartup ||
      currentSettings.launchHidden !== settings.launchHidden)
  ) {
    setAutoLaunch(settings.launchOnStartup, settings.launchHidden).catch((err) =>
      Logger.error('Failed to update auto-launch setting:', err),
    );
  }

  currentSettings = settings;
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } catch (error) {
    Logger.error('Failed to save settings:', error);
  }
}

export function saveSettingsJson(settingsJson: string): void {
  Logger.debug(settingsJson);
  const newSettings = JSON.parse(settingsJson);

  // Apply auto-launch setting if it changed
  if (
    currentSettings &&
    (currentSettings.launchOnStartup !== newSettings.launchOnStartup ||
      currentSettings.launchHidden !== newSettings.launchHidden)
  ) {
    setAutoLaunch(newSettings.launchOnStartup, newSettings.launchHidden).catch((err) =>
      Logger.error('Failed to update auto-launch setting:', err),
    );
  }

  currentSettings = newSettings;
  try {
    fs.writeFileSync(settingsPath, settingsJson);
  } catch (error) {
    Logger.error('Failed to save settings:', error);
  }
}

export function registerSettingsHandlers(): void {
  ipcMain.handle(Channels.LOAD_SETTINGS, () => loadSettings());
  ipcMain.handle(Channels.SAVE_SETTINGS, (_event, settingsData) => {
    saveSettings(settingsData);
  });
  ipcMain.handle(Channels.SAVE_SETTINGS_JSON, (_event, settingsData) => {
    saveSettingsJson(settingsData);
  });
}
