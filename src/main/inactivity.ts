import { powerMonitor, BrowserWindow } from 'electron';

const INACTIVITY_THRESHOLD = 5; // 1 minute
const CHECK_INTERVAL = 1000; // 10 seconds

function checkUserInactivity(): boolean {
  const idleTime = powerMonitor.getSystemIdleTime();
  return idleTime > INACTIVITY_THRESHOLD;
}

export async function startMonitoring(mainWindow: BrowserWindow | null): Promise<void> {
  let wasPreviouslyIdle = false;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, CHECK_INTERVAL));

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
