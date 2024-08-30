import { ReactElement, useEffect, useState } from 'react';
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
  removeActiveAudioDevice,
  setInitialized,
  updatePlaybackStatus,
} from './homeSlice';
import { useAudioRefs } from '../../components/AudioContext';
import {
  selectActiveAudioDevices,
  selectDevicePlaybackStatuses,
  selectIsInitialized,
} from './selectors';
import { selectDevicesState, selectIsInactivityToggled, selectIsRememberLastStateToggled } from '../settings/selectors';
import { Flex, IconButton, Text } from '@radix-ui/themes';
import { GearIcon } from '@radix-ui/react-icons';
import { PlaybackState } from '../../../../types';
import toast from 'react-hot-toast';
import { setDeviceStates } from '../settings/settingsSlice';

function HomePage(): ReactElement {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(null);

  const activeAudioDevices = useSelector(selectActiveAudioDevices);
  const devicePlaybackStatuses = useSelector(selectDevicePlaybackStatuses);
  const isInactivityToggled = useSelector(selectIsInactivityToggled);

  const isRememberLastState = useSelector(selectIsRememberLastStateToggled);
  const isInitialized = useSelector(selectIsInitialized);
  const rememberedDevices = useSelector(selectDevicesState);

  const audioRefs = useAudioRefs();

  useEffect(() => {
    console.log("useEffect!")
    if (!isInitialized) {
      console.log("hey!")
      // Run the function here
      if (isRememberLastState) {
        // do the thing
        console.log("remember")
        console.log(rememberedDevices, "rememebred devicews")
        Object.entries(rememberedDevices).forEach(([key, status]) => {
          console.log(`Device ID: ${key}, Playback State: ${status.playbackState}`);
          console.log(key, "key");
          console.log(status, 'status');

          StartAudioWork(status.deviceId, status.playbackState);
          //console.
        });
      }
      dispatch(setInitialized());
    }
  }, []);

  const startAudio = async (): Promise<void> => {
    if (selectedDevice) {
      if (activeAudioDevices.find((x) => x.mediaDeviceInfo.deviceId === selectedDevice.deviceId)) {
        toast.error('Device is already playing!', {
          style: {
            background: 'var(--color-background-mute)',
            color: 'var(--color-text)',
          },
        });
        return;
      }

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

  async function StartAudioWork(deviceId, status){
    const audio = new Audio(audioString);
    audio.loop = true;
    await audio.setSinkId(deviceId);
    audio.play();

    audioRefs[deviceId] = { current: audio };

    const newActiveAudio: ActiveAudioDevice = {
      mediaDeviceInfo: {
        deviceId: deviceId,
        groupId: '',
        kind: undefined,
        label: 'selectedDevice.label',
      },
    };

    dispatch(addActiveAudioDevice(newActiveAudio));
    dispatch(
      updatePlaybackStatus({
        deviceId: newActiveAudio.mediaDeviceInfo.deviceId,
        playbackState: status,
      }),
    );
  }

  useEffect(() => {
    if (devicePlaybackStatuses) {
      console.log(devicePlaybackStatuses);
      dispatch(setDeviceStates(devicePlaybackStatuses));
    }
  }, [devicePlaybackStatuses, dispatch]);

  const stopAudio = (activeAudioDevice: ActiveAudioDevice): void => {
    const audioElement = audioRefs[activeAudioDevice.mediaDeviceInfo.deviceId]?.current;
    audioElement!.pause();
    audioElement!.remove();

    dispatch(removeActiveAudioDevice(activeAudioDevice));
    dispatch(setDeviceStates(devicePlaybackStatuses));
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
    dispatch(setDeviceStates(devicePlaybackStatuses));
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
    dispatch(setDeviceStates(devicePlaybackStatuses));
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
        <div className="settings-title">
          <div className="flex-1"></div>
          <Text as="div" size="5" weight="bold" align="center" style={{ flex: '1 1 auto' }}>
            Home
          </Text>
          <div className="home-page-settings-button-container">
            <IconButton
              onClick={() => navigate({ to: '/settings' })}
              variant="soft"
              size="2"
              color="gray"
            >
              <GearIcon width="18" height="18" />
            </IconButton>
          </div>
        </div>

        <AudioDeviceSelector onSelectDevice={setSelectedDevice} onStartAudio={startAudio} />
        <ActiveAudioDevicesList
          activeAudioDevices={activeAudioDevices}
          playbackStatus={devicePlaybackStatuses}
          onPause={userPausedAudio}
          onResume={resumeAudio}
          onStop={stopAudio}
        />
      </div>
      <Flex justify={'center'}>
        <Version></Version>
      </Flex>
    </div>
  );
}

export default HomePage;
