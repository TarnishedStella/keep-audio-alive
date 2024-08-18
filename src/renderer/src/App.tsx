import { ReactElement, useState } from 'react';
import audioString from './assets/error.mp3';
import AudioDeviceSelector from './components/AudioDeviceSelector';
import ActiveAudioDevicesList from './components/ActiveAudioDevicesList';
import Version from './components/Version';
import { ActiveAudioDevice } from './Types';

function App(): ReactElement {
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(null);
  const [activeAudioDevices, setActiveAudioDevices] = useState<ActiveAudioDevice[]>([]);
  const [playbackStatus, setPlaybackStatus] = useState<Record<string, boolean>>({});

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
      setPlaybackStatus((prevState) => ({
        ...prevState,
        [newActiveAudio.mediaDeviceInfo.deviceId]: false,
      }));
    }
  };

  const stopAudio = (activeAudioDevice: ActiveAudioDevice) => {
    activeAudioDevice.htmlAudioElement.pause();
    activeAudioDevice.htmlAudioElement.remove();
    setActiveAudioDevices(
      activeAudioDevices.filter((x) => x.htmlAudioElement !== activeAudioDevice.htmlAudioElement),
    );
    setPlaybackStatus((prevState) => {
      const { [activeAudioDevice.mediaDeviceInfo.deviceId]: _, ...newState } = prevState;
      return newState;
    });
  };

  const pauseAudio = (activeAudioDevice: ActiveAudioDevice) => {
    activeAudioDevice.htmlAudioElement.pause();
    activeAudioDevice.htmlAudioElement.currentTime = 0;
    setPlaybackStatus((prevState) => ({
      ...prevState,
      [activeAudioDevice.mediaDeviceInfo.deviceId]: true,
    }));
  };

  const resumeAudio = (activeAudioDevice: ActiveAudioDevice) => {
    activeAudioDevice.htmlAudioElement.play();
    setPlaybackStatus((prevState) => ({
      ...prevState,
      [activeAudioDevice.mediaDeviceInfo.deviceId]: false,
    }));
  };

  return (
    <div className="main-container">
      <div className="component-container">
        {/* <Box p={'1rem'}>
          <Text as="div" size="6" weight="regular" align="center">
            Keep Audio Alive
          </Text>
        </Box> */}
        <AudioDeviceSelector onSelectDevice={setSelectedDevice} onStartAudio={startAudio} />
        <ActiveAudioDevicesList
          activeAudioDevices={activeAudioDevices}
          playbackStatus={playbackStatus}
          onPause={pauseAudio}
          onResume={resumeAudio}
          onStop={stopAudio}
        />
      </div>
      <Version></Version>
    </div>
  );
}

export default App;
