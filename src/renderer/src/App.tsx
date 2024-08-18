import React, { ReactElement, useEffect, useState } from 'react';
import audioString from './assets/error.mp3';
import {
  Box,
  Card,
  Container,
  Flex,
  Grid,
  IconButton,
  Select,
  Table,
  Text,
} from '@radix-ui/themes';
import { PauseIcon, PlusIcon, ReloadIcon, ResumeIcon, StopIcon } from '@radix-ui/react-icons';

function App(): ReactElement {
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(null);
  const [activeAudioDevices, setActiveAudioDevices] = useState<ActiveAudioDevice[]>([]);

  const [playbackStatus, setPlaybackStatus] = useState<Record<string, boolean>>(
    activeAudioDevices.reduce(
      (acc, device) => {
        acc[device.mediaDeviceInfo.deviceId] = device.htmlAudioElement.paused;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

  useEffect(() => {
    listDevices();
  }, []);

  interface ActiveAudioDevice {
    mediaDeviceInfo: MediaDeviceInfo;
    htmlAudioElement: HTMLAudioElement;
  }

  const listDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const filteredDevices = devices.filter((device) => device.kind === 'audiooutput');
    setAudioDevices(filteredDevices);
  };

  const handleDeviceChange2 = (selectedDeviceId: string) => {
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
      setPlaybackStatus((prevState) => ({
        ...prevState,
        [newActiveAudio.mediaDeviceInfo.deviceId]: false,
      }));
    }
  };

  const stopAudio = (activeAudioDevice: ActiveAudioDevice) => {
    console.log(activeAudioDevice.mediaDeviceInfo.deviceId);
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
    console.log(activeAudioDevice.htmlAudioElement.paused);
    activeAudioDevice.htmlAudioElement.pause();
    console.log(activeAudioDevice.htmlAudioElement.paused);
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

  function filterAudioDeviceLabel(label: string) {
    return label.replace(/\s*\([a-fA-F0-9]+:[a-fA-F0-9]+\)$/, '');
  }


  return (
    <div className="main-container">
      <div className="component-container">
        <Box p={'1rem'}>
          <Text as="div" size="6" weight="regular" align="center">
            Keep Audio Alive
          </Text>
        </Box>

        <div className="selector-container">
          <div className="selection-box">
            <Select.Root size={'2'} onValueChange={handleDeviceChange2}>
              <Select.Trigger
                radius="large"
                placeholder="Select an Audio Device"
                className="selection-box-trigger"
              />
              <Select.Content className="SelectContent" position="popper" sideOffset={5}>
                {audioDevices.map((device) => (
                  <Select.Item key={device.deviceId} value={device.deviceId}>
                    {filterAudioDeviceLabel(device.label)}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <div className="selection-buttons">
            <IconButton onClick={listDevices} variant="soft" size="2" color="gray">
              <ReloadIcon width="18" height="18" />
            </IconButton>
            <IconButton onClick={startAudio} variant="soft" size="2" color="green">
              <PlusIcon width="18" height="18" />
            </IconButton>
          </div>
        </div>

        <div
          style={{
            width: '100%',
            // maxWidth: '80vw',
            padding: '1rem',
            background: 'var(--gray-a2)',
            borderRadius: 'var(--radius-3)',
          }}
        >
          <Flex direction={'column'} gap={'1rem'}>
            {activeAudioDevices.length === 0 ? (
              <Text as="div" size="2" align={'center'} weight="bold">
                No Active Devices
              </Text>
            ) : (
              <>
                <Text as="div" size="2" align={'center'} weight="bold">
                  Currently Active Devices
                </Text>

                <Flex direction={'column'} gap="2">
                  {activeAudioDevices.map((device) => (
                    <Card key={device.mediaDeviceInfo.deviceId}>
                      <div className="card-grid">
                        <Text className="card-title" size={'2'}>
                          {device?.mediaDeviceInfo.label || 'Unknown Device'}
                        </Text>
                        <div className="card-buttons">
                          <IconButton
                            onClick={() => stopAudio(device)}
                            variant="soft"
                            size="2"
                            color="red"
                          >
                            <StopIcon width="18" height="18" />
                          </IconButton>

                          {playbackStatus[device.mediaDeviceInfo.deviceId] ? (
                            <IconButton
                              onClick={() => resumeAudio(device)}
                              variant="soft"
                              size="2"
                              color="green"
                            >
                              <ResumeIcon width="18" height="18" />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() => pauseAudio(device)}
                              variant="soft"
                              size="2"
                              color="red"
                            >
                              <PauseIcon width="18" height="18" />
                            </IconButton>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </Flex>
              </>
            )}
          </Flex>
        </div>
      </div>
    </div>
  );
}

export default App;
