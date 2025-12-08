import { app } from 'electron';
import AutoLaunch from 'auto-launch';

const log = require('electron-log');

/**
 * Creates an AutoLaunch instance with the specified configuration.
 *
 * @param isHidden - Whether the app should launch hidden (minimized to tray)
 * @returns AutoLaunch instance
 */
function createAutoLauncher(isHidden: boolean): AutoLaunch {
  return new AutoLaunch({
    name: 'Keep Audio Alive',
    path: app.getPath('exe'),
    isHidden: isHidden,
  });
}

/**
 * Sets the auto-launch behavior for the application.
 * Uses the auto-launch package for robust cross-platform support.
 *
 * @param enabled - Whether the app should launch on system startup
 * @param isHidden - Whether the app should launch hidden (minimized to tray)
 */
export async function setAutoLaunch(enabled: boolean, isHidden: boolean): Promise<void> {
  try {
    log.debug(`setAutoLaunch called with enabled=${enabled}, isHidden=${isHidden}`);
    const autoLauncher = createAutoLauncher(isHidden);
    const isEnabled = await autoLauncher.isEnabled();

    if (enabled) {
      // Always disable first to ensure clean state with updated settings
      if (isEnabled) {
        await autoLauncher.disable();
      }
      await autoLauncher.enable();
      log.info(`Auto-launch enabled (hidden: ${isHidden})`);
    } else if (isEnabled) {
      await autoLauncher.disable();
      log.info('Auto-launch disabled');
    }
  } catch (error) {
    log.error('Failed to set auto-launch:', error);
  }
}

/**
 * Gets the current auto-launch status from the system.
 *
 * @returns true if the app is set to launch on startup, false otherwise
 */
export async function getAutoLaunchStatus(): Promise<boolean> {
  try {
    log.debug('getAutoLaunchStatus called');
    // Hidden setting doesn't affect status check, use default
    const launcher = createAutoLauncher(true);
    return await launcher.isEnabled();
  } catch (error) {
    log.error('Failed to get auto-launch status:', error);
    return false;
  }
}
