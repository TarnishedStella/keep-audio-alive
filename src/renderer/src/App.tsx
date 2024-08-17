import React, { useState } from 'react';
import audioString from './assets/error.mp3';

function App(): JSX.Element {
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(null);
  const [activeAudioDevices, setActiveAudioDevices] = useState<ActiveAudioDevice[]>([]);

  interface ActiveAudioDevice {
    mediaDeviceInfo: MediaDeviceInfo;
    htmlAudioElement: HTMLAudioElement;
  }

  const listDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const filteredDevices = devices.filter((device) => device.kind === 'audiooutput');
    setAudioDevices(filteredDevices);
  };

  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDeviceId = event.target.value;
    const device = audioDevices.find((device) => device.deviceId === selectedDeviceId);
    console.log(selectedDeviceId);
    console.log(device);
    setSelectedDevice(device || null);
  };

  const startAudio = async () => {
    if (selectedDevice) {
      const audio = new Audio(audioString);
      audio.loop = true;
      await audio.setSinkId(selectedDevice.deviceId);
      audio.play();
      const newActiveAudio: ActiveAudioDevice = {
        htmlAudioElement: audio,
        mediaDeviceInfo: selectedDevice,
      };
      setActiveAudioDevices([...activeAudioDevices, newActiveAudio]);
    }
  };

  const stopAudio = (activeAudioDevice: ActiveAudioDevice) => {
    console.log(activeAudioDevice.mediaDeviceInfo.deviceId);
    activeAudioDevice.htmlAudioElement.pause();
    activeAudioDevice.htmlAudioElement.remove();
    setActiveAudioDevices(
      activeAudioDevices.filter((x) => x.htmlAudioElement !== activeAudioDevice.htmlAudioElement),
    );
  };

  const pauseAudio = (activeAudioDevice: ActiveAudioDevice) => {
    activeAudioDevice.htmlAudioElement.pause();
  };

  const resumeAudio = (activeAudioDevice: ActiveAudioDevice) => {
    activeAudioDevice.htmlAudioElement.play();
  };

  return (
    <>
      <header>
        <h1>Keep Audio Alive</h1>
      </header>

      <div className="content">
        <button onClick={listDevices}>Refresh</button>

        {audioDevices.length > 0 && (
          <div>
            <label htmlFor="audio-devices">Select Audio Output Device: </label>
            <select id="audio-devices" onChange={handleDeviceChange} defaultValue={1}>
              {audioDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <button onClick={startAudio} disabled={!selectedDevice}>
          Start
        </button>

        <div>
          <h2>Currently Active Devices</h2>
          <div>
            {activeAudioDevices.map((device) => (
              <div key={device.mediaDeviceInfo.deviceId}>
                <div></div>
                <ul>
                  <li>{device?.mediaDeviceInfo.label || 'Unknown Device'}</li>
                </ul>
                <button onClick={() => stopAudio(device)}>Stop Audio</button>
                <button onClick={() => pauseAudio(device)}>Pause</button>
                <button onClick={() => resumeAudio(device)}>Resume</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
