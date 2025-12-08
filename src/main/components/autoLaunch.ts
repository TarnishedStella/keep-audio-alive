import { app } from 'electron';
import AutoLaunch from 'auto-launch';
import { Logger } from '../../common/Logger';

let autoLauncher: AutoLaunch | null = null;
let currentHiddenSetting = true; // Track the current hidden setting

/**
 * Gets or creates the AutoLaunch instance with the specified configuration.
 *
 * @param isHidden - Whether the app should launch hidden (minimized to tray)
 * @returns AutoLaunch instance
 */
function getAutoLauncher(isHidden: boolean): AutoLaunch {
  // Recreate the instance if the hidden setting changed
  if (!autoLauncher || currentHiddenSetting !== isHidden) {
    autoLauncher = new AutoLaunch({
      name: 'Keep Audio Alive',
      path: app.getPath('exe'),
      isHidden: isHidden,
    });
    currentHiddenSetting = isHidden;
  }
  return autoLauncher;
}

/**
 * Sets the auto-launch behavior for the application.
 * Uses the auto-launch package for robust cross-platform support.
 *
 * @param enabled - Whether the app should launch on system startup
 * @param isHidden - Whether the app should launch hidden (minimized to tray)
 */
export async function setAutoLaunch(enabled: boolean, isHidden = true): Promise<void> {
  try {
    const launcher = getAutoLauncher(isHidden);
    const isEnabled = await launcher.isEnabled();

    if (enabled && !isEnabled) {
      await launcher.enable();
      Logger.info(`Auto-launch enabled (hidden: ${isHidden})`);
    } else if (!enabled && isEnabled) {
      await launcher.disable();
      Logger.info('Auto-launch disabled');
    } else if (enabled && isEnabled) {
      // Re-enable to update the hidden setting if it changed
      await launcher.disable();
      await launcher.enable();
      Logger.info(`Auto-launch updated (hidden: ${isHidden})`);
    }
  } catch (error) {
    Logger.error('Failed to set auto-launch:', error);
  }
}

/**
 * Gets the current auto-launch status from the system.
 *
 * @returns true if the app is set to launch on startup, false otherwise
 */
export async function getAutoLaunchStatus(): Promise<boolean> {
  try {
    const launcher = getAutoLauncher(currentHiddenSetting);
    return await launcher.isEnabled();
  } catch (error) {
    Logger.error('Failed to get auto-launch status:', error);
    return false;
  }
}
