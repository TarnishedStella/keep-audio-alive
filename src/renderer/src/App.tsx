import Versions from './components/Versions';
import electronLogo from './assets/electron.svg';

import audioString from './assets/error.mp3';

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping');

  async function listDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log(devices);

    const audioDevices = devices.filter((device) => device.kind === 'audiooutput');
    console.log(audioDevices);

    const audioDevice = devices.find((device) => device.kind === 'audiooutput' && device.label === 'default');

    const audio = document.createElement('audio');
    audio.src = audioString;
    audio.play();
    audio.loop = true

    await audio.setSinkId(audioDevice!.deviceId);
    console.log(`Audio is being output on ${audio.sinkId}`);
  }

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={listDevices}>
            Send IPC
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
  );
}

export default App;
