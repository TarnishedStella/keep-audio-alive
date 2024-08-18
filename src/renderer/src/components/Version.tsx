import { useEffect, useState } from 'react';

function Versions(): JSX.Element {
  const [appVersion, setAppVersion] = useState<string>('');

  useEffect(() => {
    const fetchDevices = async () => {
      const devices = await window.api.getAppVersion();
      setAppVersion(devices);
    };

    fetchDevices();
  }, []);

  return (
    <ul className="versions">
      <li className="electron-version">KeepAudioAlive v{appVersion}</li>
    </ul>
  );
}

export default Versions;
