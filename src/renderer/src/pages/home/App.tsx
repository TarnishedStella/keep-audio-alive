import { ReactElement, useState } from 'react';
import audioString from '../../assets/error.mp3';
import AudioDeviceSelector from '../../components/AudioDeviceSelector';
import ActiveAudioDevicesList from '../../components/ActiveAudioDevicesList';
import Version from '../../components/Version';
import { ActiveAudioDevice } from '../../Types';
import { useNavigate } from '@tanstack/react-router';
import useIpcListener from '../../hooks';
import { useDispatch, useSelector } from 'react-redux';
import {
  addActiveAudioDevice,
  PlaybackState,
  removeActiveAudioDevice,
  updatePlaybackStatus,
} from './homeSlice';
import { useAudioRefs } from '../../components/AudioContext';
import { selectActiveAudioDevices, selectDevicePlaybackStatuses } from './selectors';
import { selectIsInactivityToggled } from '../settings/selectors';
import { Flex, IconButton } from '@radix-ui/themes';
import { GearIcon } from '@radix-ui/react-icons';

function App(): ReactElement {
  const navigate = useNavigate({ from: '/posts/$postId' });

  const dispatch = useDispatch();
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(null);

  const activeAudioDevices = useSelector(selectActiveAudioDevices);
  const devicePlaybackStatuses = useSelector(selectDevicePlaybackStatuses);
  const isInactivityToggled = useSelector(selectIsInactivityToggled);

  const audioRefs = useAudioRefs();

  const startAudio = async (): Promise<void> => {
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

  const stopAudio = (activeAudioDevice: ActiveAudioDevice): void => {
    const audioElement = audioRefs[activeAudioDevice.mediaDeviceInfo.deviceId]?.current;
    audioElement!.pause();
    audioElement!.remove();

    dispatch(removeActiveAudioDevice(activeAudioDevice));
  };

  const userPausedAudio = (activeAudioDevice: ActiveAudioDevice): void => {
    pauseAudio(activeAudioDevice, true);
  };

  const pauseAudio = (activeAudioDevice: ActiveAudioDevice, userPaused: boolean): void => {
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

  const resumeAudio = (activeAudioDevice: ActiveAudioDevice): void => {
    const audioElement = audioRefs[activeAudioDevice.mediaDeviceInfo.deviceId]?.current;
    audioElement!.play();

    dispatch(
      updatePlaybackStatus({
        deviceId: activeAudioDevice.mediaDeviceInfo.deviceId,
        playbackState: PlaybackState.Playing,
      }),
    );
  };

  function pauseActiveDevices(userPaused: boolean): void {
    console.log('pausing devices');
    activeAudioDevices.forEach((device) => {
      const playbackState = devicePlaybackStatuses[device.mediaDeviceInfo.deviceId].playbackState;
      if (playbackState === PlaybackState.Playing) {
        pauseAudio(device, userPaused);
      }
    });
  }

  function resumeActiveDevices(): void {
    console.log('resuming devices');
    activeAudioDevices.forEach((device) => {
      const playbackState = devicePlaybackStatuses[device.mediaDeviceInfo.deviceId].playbackState;
      if (playbackState === PlaybackState.IdlePaused) {
        resumeAudio(device);
      }
    });
  }

  useIpcListener('user-inactive', () => {
    console.log('User is inactive!');
    if (isInactivityToggled) {
      pauseActiveDevices(false);
    }
  });

  useIpcListener('user-active', () => {
    console.log('User is active again!');
    if (isInactivityToggled) {
      resumeActiveDevices();
    }
  });

  useIpcListener('pause-all', () => {
    console.log('pause-all');
    activeAudioDevices.forEach((device) => {
      pauseAudio(device, true);
    });
  });

  useIpcListener('resume-all', () => {
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
      <Flex justify={'end'} mb={'3'}>
        {/* <Text as="div" size="6" weight="regular" align="center" style={{ paddingRight: '1rem' }}>
          Home
        </Text> */}
        <Version></Version>
        <IconButton
          onClick={() => navigate({ to: '/settings' })}
          variant="soft"
          size="2"
          color="gray"
        >
          <GearIcon width="18" height="18" />
        </IconButton>
      </Flex>
    </div>
  );
}

export default App;
