import { useState, useEffect } from 'react';
import { useAppSelector } from '@renderer/hooks';
import { RootState } from '@renderer/store';

interface WhatsNewCheckResult {
  showWhatsNew: boolean;
  currentVersion: string;
  dismissWhatsNew: () => Promise<void>;
}

/**
 * Hook to check if the "What's New" dialog should be shown.
 * Compares the current app version with the last seen version in settings.
 * Shows the dialog once after an update, then updates the lastSeenVersion.
 */
export function useWhatsNewCheck(): WhatsNewCheckResult {
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const [currentVersion, setCurrentVersion] = useState('');

  const settings = useAppSelector((state: RootState) => state.settings);

  useEffect(() => {
    const checkVersion = async (): Promise<void> => {
      try {
        const appVersion = await window.api.getAppVersion();
        console.log('Current app version:', appVersion);
        setCurrentVersion(appVersion);

        const shouldShow = settings.lastSeenVersion !== appVersion;

        setShowWhatsNew(shouldShow);
      } catch (error) {
        console.error('Failed to check app version:', error);
      }
    };

    checkVersion();
  }, []);

  const dismissWhatsNew = async (): Promise<void> => {
    try {
      // Update lastSeenVersion to current version
      const updatedSettings = {
        ...settings,
        lastSeenVersion: currentVersion,
      };

      await window.api.saveSettingsJson(JSON.stringify(updatedSettings, null, 2));
      setShowWhatsNew(false);
    } catch (error) {
      console.error('Failed to update lastSeenVersion:', error);
    }
  };

  return {
    showWhatsNew,
    currentVersion,
    dismissWhatsNew,
  };
}
