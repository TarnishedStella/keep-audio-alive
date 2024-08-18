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
  setSelectedDevice,
  updatePlaybackStatus,
} from './pages/home/homeSlice';
import { useAudioRefs } from './components/AudioContext';

const audioRefsSingleton: { [key: string]: { current: HTMLAudioElement | null } } = {};

function App(): ReactElement {
  const navigate = useNavigate({ from: '/posts/$postId' });

  const dispatch = useDispatch();
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(null);

  //const selectedDevice = useSelector((state: RootState) => state.home.audioManager.selectedDevice);
  const activeAudioDevices = useSelector(
    (state: RootState) => state.home.audioManager.activeAudioDevices,
  );
  const playbackStatus = useSelector((state: RootState) => state.home.audioManager.playbackStatus);

  const audioRefs = useAudioRefs();
  //const audioRefs = useRef<{ [key: string]: React.RefObject<HTMLAudioElement> }>({});

  // const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(null);
  // const [activeAudioDevices, setActiveAudioDevices] = useState<ActiveAudioDevice[]>([]);
  // const [playbackStatus, setPlaybackStatus] = useState<Record<string, boolean>>({});

  // const handleDeviceChange = (device: MediaDeviceInfo | null) => {
  //   dispatch(setSelectedDevice(device));
  // };

  const startAudio = async () => {
    if (selectedDevice) {
      const audio = new Audio(audioString);
      audio.loop = true;
      await audio.setSinkId(selectedDevice.deviceId);
      audio.play();

      audioRefs[selectedDevice.deviceId] = { current: audio };

      const newActiveAudio: ActiveAudioDevice = {
        // htmlAudioElement: audio,
        mediaDeviceInfo: {
          deviceId: selectedDevice.deviceId,
          groupId: selectedDevice.groupId,
          kind: selectedDevice.kind,
          label: selectedDevice.label,
        },
        //htmlAudioElement: audioRefs.current[selectedDevice.deviceId]
      };
      // setActiveAudioDevices([...activeAudioDevices, newActiveAudio]);

      dispatch(addActiveAudioDevice(newActiveAudio));
      dispatch(
        updatePlaybackStatus({
          deviceId: newActiveAudio.mediaDeviceInfo.deviceId,
          isPaused: false,
        }),
      );
      // setPlaybackStatus((prevState) => ({
      //   ...prevState,
      //   [newActiveAudio.mediaDeviceInfo.deviceId]: false,
      // }));
    }
  };

  const stopAudio = (activeAudioDevice: ActiveAudioDevice) => {
    const audioElement = audioRefs[activeAudioDevice.mediaDeviceInfo.deviceId]?.current;
    audioElement!.pause();
    audioElement!.remove();

    dispatch(removeActiveAudioDevice(activeAudioDevice));
    // dispatch(
    //   updatePlaybackStatus({
    //     deviceId: activeAudioDevice.mediaDeviceInfo.deviceId,
    //     isPaused: false,
    //   }),
    // );

    // setActiveAudioDevices(
    //   activeAudioDevices.filter((x) => x.htmlAudioElement !== activeAudioDevice.htmlAudioElement),
    // );
    // setPlaybackStatus((prevState) => {
    //   const { [activeAudioDevice.mediaDeviceInfo.deviceId]: _, ...newState } = prevState;
    //   return newState;
    // });
  };

  const pauseAudio = (activeAudioDevice: ActiveAudioDevice) => {
    console.log(audioRefs);

    const audioElement = audioRefs[activeAudioDevice.mediaDeviceInfo.deviceId]?.current;
    audioElement!.pause();
    audioElement!.currentTime = 0;

    dispatch(
      updatePlaybackStatus({
        deviceId: activeAudioDevice.mediaDeviceInfo.deviceId,
        isPaused: true,
      }),
    );
    // setPlaybackStatus((prevState) => ({
    //   ...prevState,
    //   [activeAudioDevice.mediaDeviceInfo.deviceId]: true,
    // }));
  };

  const resumeAudio = (activeAudioDevice: ActiveAudioDevice) => {
    const audioElement = audioRefs[activeAudioDevice.mediaDeviceInfo.deviceId]?.current;
    audioElement!.play();

    dispatch(
      updatePlaybackStatus({
        deviceId: activeAudioDevice.mediaDeviceInfo.deviceId,
        isPaused: false,
      }),
    );
    // setPlaybackStatus((prevState) => ({
    //   ...prevState,
    //   [activeAudioDevice.mediaDeviceInfo.deviceId]: false,
    // }));
  };

  function pauseActiveDevices() {
    console.log('User is inactive!');
    activeAudioDevices.forEach((device) => {
      pauseAudio(device);
    });
  }

  function resumeActiveDevices() {
    console.log('User is active again!');
    activeAudioDevices.forEach((device) => {
      resumeAudio(device);
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
          onPause={pauseAudio}
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
