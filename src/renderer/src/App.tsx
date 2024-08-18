import React, { ReactElement, useState } from 'react';
import audioString from './assets/error.mp3';
import { Box, Card, Container, Flex, Grid, IconButton, Select, Text } from '@radix-ui/themes';
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

  return (
    <div className="main-container">
      <Flex direction="column" gap="1rem" align={'center'}>
        <Text as="div" size="6" weight="bold">
          Keep Audio Alive
        </Text>

        <Grid gap={'0.5rem'} columns="80% 20%" width="50vw">
          {audioDevices.length > 0 && (
            <Flex direction="column">
              <Select.Root size={'2'} onValueChange={handleDeviceChange2}>
                <Select.Trigger radius="large" placeholder="Select an Audio Device" />
                <Select.Content position="popper">
                  {audioDevices.map((device) => (
                    <Select.Item key={device.deviceId} value={device.deviceId}>
                      {device.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Flex>
          )}
          <Flex gap={'2'}>
            <IconButton onClick={listDevices} variant="soft" size="2" color="gray">
              <ReloadIcon width="18" height="18" />
            </IconButton>
            <IconButton onClick={startAudio} variant="soft" size="2" color="green">
              <PlusIcon width="18" height="18" />
            </IconButton>
          </Flex>
        </Grid>

        {/* <Card variant="surface" size={'1'}> */}
        <Box
          style={{
            width: '100%',
            maxWidth: '100%',
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
              <Text as="div" size="2" align={'center'} weight="bold">
                Currently Active Devices
              </Text>
            )}

            {activeAudioDevices.map((device) => (
              <Grid columns="1" gap="3" width="auto">
                <Flex key={device.mediaDeviceInfo.deviceId} gap={'0.5rem'}>
                  <Text>{device?.mediaDeviceInfo.label || 'Unknown Device'}</Text>

                  <Flex gap={'0.5rem'}>
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
                  </Flex>
                </Flex>
              </Grid>
            ))}
          </Flex>
        </Box>
        {/* </Card> */}
        {/* <div>
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
        </div> */}
      </Flex>
    </div>
  );
}

export default App;
