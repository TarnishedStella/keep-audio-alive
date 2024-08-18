import { ReactElement, useRef, useState } from 'react';
import audioString from './assets/error.mp3';
import AudioDeviceSelector from './components/AudioDeviceSelector';
import ActiveAudioDevicesList from './components/ActiveAudioDevicesList';
import Version from './components/Version';
import { ActiveAudioDevice } from './Types';
import { useNavigate } from '@tanstack/react-router';
import useIpcListener from './hooks';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import {
  addActiveAudioDevice,
  removeActiveAudioDevice,
  updatePlaybackStatus,
} from './pages/home/homeSlice';
import { useAudioRefs } from './components/AudioContext';

function App(): ReactElement {
  const navigate = useNavigate({ from: '/posts/$postId' });

  const dispatch = useDispatch();
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(null);

  const activeAudioDevices = useSelector(
    (state: RootState) => state.home.audioManager.activeAudioDevices,
  );
  const playbackStatus = useSelector((state: RootState) => state.home.audioManager.playbackStatus);

  const isInactivityToggled = useSelector((state: RootState) => state.settings.inactivityToggle);

  const audioRefs = useAudioRefs();

  const startAudio = async () => {
    if (selectedDevice) {
      const audio = new Audio(audioString);
      audio.loop = true;
      await audio.setSinkId(selectedDevice.deviceId);
      audio.play();

      audioRefs[selectedDevice.deviceId] = { current: audio };

      const newActiveAudio: ActiveAudioDevice = {
        mediaDeviceInfo: {
          deviceId: selectedDevice.deviceId,
          groupId: selectedDevice.groupId,
          kind: selectedDevice.kind,
          label: selectedDevice.label,
        },
      };

      dispatch(addActiveAudioDevice(newActiveAudio));
      dispatch(
        updatePlaybackStatus({
          deviceId: newActiveAudio.mediaDeviceInfo.deviceId,
          isPaused: false,
          userPaused: false,
        }),
      );
    }
  };

  const stopAudio = (activeAudioDevice: ActiveAudioDevice) => {
    const audioElement = audioRefs[activeAudioDevice.mediaDeviceInfo.deviceId]?.current;
    audioElement!.pause();
    audioElement!.remove();

    dispatch(removeActiveAudioDevice(activeAudioDevice));
  };

  const userPausedAudio = (activeAudioDevice: ActiveAudioDevice) => {
    pauseAudio(activeAudioDevice, true);
  };

  const pauseAudio = (activeAudioDevice: ActiveAudioDevice, userPaused: boolean) => {
    console.log(audioRefs);

    const audioElement = audioRefs[activeAudioDevice.mediaDeviceInfo.deviceId]?.current;
    audioElement!.pause();
    audioElement!.currentTime = 0;

    dispatch(
      updatePlaybackStatus({
        deviceId: activeAudioDevice.mediaDeviceInfo.deviceId,
        isPaused: true,
        userPaused: userPaused,
      }),
    );
  };

  const resumeAudio = (activeAudioDevice: ActiveAudioDevice) => {
    const audioElement = audioRefs[activeAudioDevice.mediaDeviceInfo.deviceId]?.current;
    audioElement!.play();

    dispatch(
      updatePlaybackStatus({
        deviceId: activeAudioDevice.mediaDeviceInfo.deviceId,
        isPaused: false,
        userPaused: false,
      }),
    );
  };

  function pauseActiveDevices() {
    console.log('User is inactive!');

    if (isInactivityToggled) {
      console.log('pausing devices');
      activeAudioDevices.forEach((device) => {
        if (!playbackStatus[device.mediaDeviceInfo.deviceId].userPaused) {
          pauseAudio(device, false);
        }
      });
    }
  }

  function resumeActiveDevices() {
    console.log('User is active again!');
    activeAudioDevices.forEach((device) => {
      if (!playbackStatus[device.mediaDeviceInfo.deviceId].userPaused) {
        resumeAudio(device);
      }
    });
  }

  useIpcListener('user-inactive', (event, ...args) => {
    pauseActiveDevices();
  });

  useIpcListener('user-active', (event, ...args) => {
    resumeActiveDevices();
  });

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
          onPause={userPausedAudio}
          onResume={resumeAudio}
          onStop={stopAudio}
        />
      </div>
      <button onClick={() => navigate({ to: '/settings' })}>test</button>
      <Version></Version>
    </div>
  );
}

export default App;
