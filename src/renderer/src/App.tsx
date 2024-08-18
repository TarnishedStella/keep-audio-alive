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

  function filterAudioDeviceLabel(label: string){
    return label.replace(/\s*\([a-fA-F0-9]+:[a-fA-F0-9]+\)$/, '');
  }

  return (
    <div className="main-container">
      <div className="component-container">
        {/* <Flex direction="column" gap="1rem" align={'center'} minWidth={"500px"}> */}
        <Box p={'1rem'}>
          <Text as="div" size="6" weight="regular" align="center">
            Keep Audio Alive
          </Text>
        </Box>

        <div className="selector-container">
          <div className="selection-box">
            <Select.Root size={'2'} onValueChange={handleDeviceChange2}>
              <Select.Trigger radius="large" placeholder="Select an Audio Device" className='selection-box-trigger' />
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
            {/* <Flex gap={'2'}> */}
            <IconButton onClick={listDevices} variant="soft" size="2" color="gray">
              <ReloadIcon width="18" height="18" />
            </IconButton>
            <IconButton onClick={startAudio} variant="soft" size="2" color="green">
              <PlusIcon width="18" height="18" />
            </IconButton>
            {/* </Flex> */}
          </div>
        </div>

        {/* <Grid gap={'0.5rem'} columns="80% 20%" width="50vw">
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
        </Grid> */}

        {/* <Card variant="surface" size={'1'}> */}
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

                      {/* <Grid p={'1'} columns="85% 15%"> */}
                      {/* <Text>{device?.mediaDeviceInfo.label || 'Unknown Device'}</Text> */}

                      {/* <Grid columns="2" align={'center'}>
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
                      </Grid> */}
                      {/* </Grid> */}
                    </Card>
                  ))}
                </Flex>
              </>
            )}
            {/* <Table.Root style={{ width: '100%', maxWidth: '100%' }}>
              <Table.Body style={{ width: '100%', maxWidth: '100%' }}>
                {activeAudioDevices.map((device) => (
                  <Table.Row key={device.mediaDeviceInfo.deviceId} align={'center'}>
                    <Table.Cell style={{ width: '80%' }}>
                      {device?.mediaDeviceInfo.label || 'Unknown Device'}
                    </Table.Cell>
                    <Table.Cell style={{ width: '20%' }} align="right" justify={'end'}>
                      <Grid columns="2" justify={'end'}>
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
                      </Grid>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root> */}

            {/* {activeAudioDevices.map((device) => (
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
            ))} */}
          </Flex>
        </div>
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
        {/* </Flex> */}
      </div>
    </div>
  );
}

export default App;
