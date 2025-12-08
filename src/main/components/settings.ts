import { app, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import { ApplicationSettings } from '@common/types';
import { Channels } from '../../common/ipc';
import { setAutoLaunch } from './autoLaunch';

const log = require('electron-log');

const settingsPath = path.join(app.getPath('userData'), 'settings.json');

let currentSettings: ApplicationSettings;

/**
 * Updates auto-launch settings if they have changed.
 */
function updateAutoLaunchIfChanged(newSettings: ApplicationSettings): void {
  if (
    currentSettings &&
    (currentSettings.launchOnStartup !== newSettings.launchOnStartup ||
      currentSettings.launchHidden !== newSettings.launchHidden)
  ) {
    setAutoLaunch(newSettings.launchOnStartup, newSettings.launchHidden).catch((err) =>
      log.error('Failed to update auto-launch setting:', err),
    );
  }
}

export function getSettingsFromMemory(): ApplicationSettings {
  return currentSettings;
}

/**
 * Initializes auto-launch settings from saved preferences.
 * Call this on app startup to restore auto-launch after updates/reinstalls.
 */
export async function initializeAutoLaunch(): Promise<void> {
  try {
    const settings = loadSettings();
    if (settings.launchOnStartup) {
      log.info('Restoring auto-launch setting from preferences');
      await setAutoLaunch(true, settings.launchHidden);
    }
  } catch (error) {
    log.error('Failed to initialize auto-launch:', error);
  }
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
      lastSeenVersion: app.getVersion(),
    };
    saveSettings(defaultSettings);
    return defaultSettings;
  } catch (error) {
    log.error('Failed to load settings:', error);
    throw error;
  }
}

export function saveSettings(settings: ApplicationSettings): void {
  log.debug('saveSettings', settings);
  updateAutoLaunchIfChanged(settings);
  currentSettings = settings;
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } catch (error) {
    log.error('Failed to save settings:', error);
  }
}

export function saveSettingsJson(settingsJson: string): void {
  log.debug('saveSettingsJson', settingsJson);
  const newSettings = JSON.parse(settingsJson);
  updateAutoLaunchIfChanged(newSettings);
  currentSettings = newSettings;
  try {
    fs.writeFileSync(settingsPath, settingsJson);
  } catch (error) {
    log.error('Failed to save settings:', error);
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
