/**
 * custom channels used in the application
 */
export enum Channels {
  // Updater Events
  UPDATE_DOWNLOAD_EVENT = 'download-update',
  GET_APP_VERSION = 'get-app-version',

  // Settings
  LOAD_SETTINGS = 'load-settings',
  SAVE_SETTINGS = 'save-settings',
  SAVE_SETTINGS_JSON = 'save-settings-json',

  // Audio State (for the tray)
  PLAYING_AUDIO = 'playing-audio',
  NOT_PLAYING_AUDIO = 'not-playing-audio',
}

/**
 * Specific for the updater package
 */
export enum AutoUpdaterChannels {
  CHECKING_FOR_UPDATE = 'checking-for-update',
  DOWNLOAD_PROGRESS = 'download-progress',
  UPDATE_ERROR = 'error',
  UPDATE_DOWNLOADED = 'update-downloaded',
  UPDATE_AVAILABLE = 'update-available',
}
