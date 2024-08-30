import { useEffect, useState } from 'react';
import { IconButton, Text } from '@radix-ui/themes';
import { DownloadIcon } from '@radix-ui/react-icons';

function Version(): JSX.Element {
  const [appVersion, setAppVersion] = useState<string>('');
  const [hasUpdate] = useState<boolean>(false); // TODO: Implement this

  useEffect(() => {
    const fetchCurrentVersion = async (): Promise<void> => {
      const appVersion = await window.api.getAppVersion();
      setAppVersion(appVersion);
    };

    fetchCurrentVersion();
  }, []);

  return (
    <div className="version-container">
      <Text className="version-text">KeepAudioAlive v{appVersion}</Text>
      {hasUpdate && (
        <IconButton>
          <DownloadIcon />
        </IconButton>
      )}
    </div>
  );
}

export default Version;
