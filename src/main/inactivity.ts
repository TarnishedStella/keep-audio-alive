import { powerMonitor, BrowserWindow } from 'electron';
import { getSettingsFromMemory } from './settings';

const MS_PER_SEC = 1000;
const SEC_PER_MIN = 60;
const CHECK_INTERVAL = 10 * MS_PER_SEC;

let inactivityThreshold = 5;

export async function startMonitoring(mainWindow: BrowserWindow | null): Promise<void> {
  let wasPreviouslyIdle = false;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, CHECK_INTERVAL));

    const currentSettings = getSettingsFromMemory();
    if (currentSettings.inactivityToggle) {
      inactivityThreshold = currentSettings.inactivityTimer * SEC_PER_MIN;
      const isNowIdle = checkUserInactivity();

      if (isNowIdle && !wasPreviouslyIdle) {
        mainWindow!.webContents.send('user-inactive');
        wasPreviouslyIdle = true;
      }

      if (wasPreviouslyIdle && !isNowIdle) {
        mainWindow!.webContents.send('user-active');
        wasPreviouslyIdle = false;
      }
    }
  }
}

function checkUserInactivity(): boolean {
  const idleTime = powerMonitor.getSystemIdleTime();
  return idleTime > inactivityThreshold;
}
