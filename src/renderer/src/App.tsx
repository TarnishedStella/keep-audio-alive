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
  PlaybackState,
  removeActiveAudioDevice,
  updatePlaybackStatus,
} from './pages/home/homeSlice';
import { useAudioRefs } from './components/AudioContext';
import { selectActiveAudioDevices, selectDevicePlaybackStatuses } from './pages/home/selectors';
import { selectIsInactivityToggled } from './pages/settings/selectors';

function App(): ReactElement {
  const navigate = useNavigate({ from: '/posts/$postId' });

  const dispatch = useDispatch();
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(null);

  const activeAudioDevices = useSelector(selectActiveAudioDevices);
  const devicePlaybackStatuses = useSelector(selectDevicePlaybackStatuses);
  const isInactivityToggled = useSelector(selectIsInactivityToggled);

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
          playbackState: PlaybackState.Playing,
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
        playbackState: userPaused ? PlaybackState.UserPaused : PlaybackState.IdlePaused,
      }),
    );
  };

  const resumeAudio = (activeAudioDevice: ActiveAudioDevice) => {
    const audioElement = audioRefs[activeAudioDevice.mediaDeviceInfo.deviceId]?.current;
    audioElement!.play();

    dispatch(
      updatePlaybackStatus({
        deviceId: activeAudioDevice.mediaDeviceInfo.deviceId,
        playbackState: PlaybackState.Playing,
      }),
    );
  };

  function pauseActiveDevices(userPaused: boolean) {
    console.log('pausing devices');
    activeAudioDevices.forEach((device) => {
      const playbackState = devicePlaybackStatuses[device.mediaDeviceInfo.deviceId].playbackState;
      if (playbackState === PlaybackState.Playing) {
        pauseAudio(device, userPaused);
      }
    });
  }

  function resumeActiveDevices() {
    console.log('resuming devices');
    activeAudioDevices.forEach((device) => {
      const playbackState = devicePlaybackStatuses[device.mediaDeviceInfo.deviceId].playbackState;
      if (playbackState === PlaybackState.IdlePaused) {
        resumeAudio(device);
      }
    });
  }

  useIpcListener('user-inactive', (event, ...args) => {
    console.log('User is inactive!');
    if (isInactivityToggled) {
      pauseActiveDevices(false);
    }
  });

  useIpcListener('user-active', (event, ...args) => {
    console.log('User is active again!');
    if (isInactivityToggled) {
      resumeActiveDevices();
    }
  });

  useIpcListener('pause-all', (event, ...args) => {
    console.log('pause-all');
    activeAudioDevices.forEach((device) => {
      pauseAudio(device, true);
    });
  });

  useIpcListener('resume-all', (event, ...args) => {
    console.log('resume-all');
    activeAudioDevices.forEach((device) => {
      resumeAudio(device);
    });
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
          playbackStatus={devicePlaybackStatuses}
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
