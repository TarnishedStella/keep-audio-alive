import { ReactElement, useEffect, useState } from 'react';
import audioString from '@renderer/assets/nothing.mp3';
import AudioDeviceSelector from '@renderer/components/AudioDeviceSelector';
import ActiveAudioDevicesList from '@renderer/components/ActiveAudioDevicesList';
import Version from '@renderer/components/Version';
import { ActiveAudioDevice } from '@renderer/types';
import { useNavigate } from '@tanstack/react-router';
import useIpcListener from '@renderer/hooks';
import { useDispatch, useSelector } from 'react-redux';
import {
  addActiveAudioDevice,
  removeActiveAudioDevice,
  setInitialized,
  updatePlaybackStatus,
} from '@renderer/pages/home/homeSlice';
import { useAudioRefs } from '@renderer/components/AudioContext';
import {
  selectActiveAudioDevices,
  selectDevicePlaybackStatuses,
  selectIsInitialized,
} from '@renderer/pages/home/selectors';
import {
  selectDevicesState,
  selectIsInactivityToggled,
  selectIsRememberLastStateToggled,
} from '@renderer/pages/settings/selectors';
import { Flex, IconButton, Text } from '@radix-ui/themes';
import { GearIcon } from '@radix-ui/react-icons';
import { MediaDeviceInfoCustom, PlaybackState } from '@common/types';
import { setDeviceStates } from '@renderer/pages/settings/settingsSlice';
import { showErrorToast } from '@renderer/common/ToastManager';

function HomePage(): ReactElement {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfoCustom | null>(null);

  const activeAudioDevices = useSelector(selectActiveAudioDevices);
  const devicePlaybackStatuses = useSelector(selectDevicePlaybackStatuses);
  const isInactivityToggled = useSelector(selectIsInactivityToggled);

  const isRememberLastState = useSelector(selectIsRememberLastStateToggled);
  const isInitialized = useSelector(selectIsInitialized);
  const rememberedDevices = useSelector(selectDevicesState);

  const audioRefs = useAudioRefs();

  useEffect(() => {
    if (!isInitialized) {
      dispatch(setInitialized());
      if (isRememberLastState) {
        Object.entries(rememberedDevices).forEach(([, status]) => {
          handleAudioDevice(status.deviceDetails, status.playbackState);
        });
      }
    }
  }, []);

  const startAudio = async (): Promise<void> => {
    if (selectedDevice) {
      if (isDeviceAlreadyActive(selectedDevice.deviceId)) {
        showErrorToast('Device already active');
        return;
      }

      await handleAudioDevice(selectedDevice, PlaybackState.Playing);
    }
  };

  const isDeviceAlreadyActive = (deviceId: string): boolean => {
    return activeAudioDevices.some((x) => x.mediaDeviceInfo.deviceId === deviceId);
  };

  const handleAudioDevice = async (
    deviceDetails: MediaDeviceInfoCustom,
    status: PlaybackState,
  ): Promise<void> => {
    const audio = new Audio(audioString);
    audio.loop = true;
    await audio.setSinkId(deviceDetails.deviceId);

    if (status === PlaybackState.Playing) {
      audio.play();
    }

    audioRefs[deviceDetails.deviceId] = { current: audio };

    const newActiveAudio: ActiveAudioDevice = {
      mediaDeviceInfo: {
        deviceId: deviceDetails.deviceId,
        groupId: deviceDetails.groupId,
        kind: deviceDetails.kind,
        label: deviceDetails.label,
      },
    };

    dispatch(addActiveAudioDevice(newActiveAudio));
    dispatch(
      updatePlaybackStatus({
        deviceDetails: newActiveAudio.mediaDeviceInfo,
        playbackState: status,
      }),
    );
  };

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
        deviceDetails: activeAudioDevice.mediaDeviceInfo,
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
        deviceDetails: activeAudioDevice.mediaDeviceInfo,
        playbackState: PlaybackState.Playing,
      }),
    );
    dispatch(setDeviceStates(devicePlaybackStatuses));
  };

  function pauseActiveDevices(userPaused: boolean): void {
    console.log('pausing devices');
    activeAudioDevices.forEach((device) => {
      const { playbackState } = devicePlaybackStatuses[device.mediaDeviceInfo.deviceId];
      if (playbackState === PlaybackState.Playing) {
        pauseAudio(device, userPaused);
      }
    });
  }

  function resumeActiveDevices(): void {
    console.log('resuming devices');
    activeAudioDevices.forEach((device) => {
      const { playbackState } = devicePlaybackStatuses[device.mediaDeviceInfo.deviceId];
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
          <div className="flex-1" />
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
      <Flex justify="center">
        <Version />
      </Flex>
    </div>
  );
}

export default HomePage;
