import React from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { ActiveAudioDevice } from '@renderer/types';
import { IPlaybackStatus, PlaybackState } from '@common/types';
import ActiveAudioDeviceCard from './ActiveAudioDeviceCard';

interface ActiveAudioDevicesListProps {
  activeAudioDevices: ActiveAudioDevice[];
  playbackStatus: Record<string, IPlaybackStatus>;
  onPause: (device: ActiveAudioDevice) => void;
  onResume: (device: ActiveAudioDevice) => void;
  onStop: (device: ActiveAudioDevice) => void;
}

const ActiveAudioDevicesList: React.FC<ActiveAudioDevicesListProps> = ({
  activeAudioDevices,
  playbackStatus,
  onPause,
  onResume,
  onStop,
}) => {
  return (
    <div
      style={{
        width: '100%',
        padding: '1rem',
        background: 'var(--gray-a2)',
        borderRadius: 'var(--radius-3)',
      }}
    >
      <Flex direction="column" gap="1rem">
        {activeAudioDevices.length === 0 ? (
          <Text as="div" size="2" align="center" weight="bold">
            No Active Devices
          </Text>
        ) : (
          <>
            <Text as="div" size="2" align="center" weight="bold">
              Currently Active Devices
            </Text>
            <Flex direction="column" gap="2">
              {activeAudioDevices.map((device) => (
                <ActiveAudioDeviceCard
                  key={device.mediaDeviceInfo.deviceId}
                  device={device}
                  onPause={() => onPause(device)}
                  onResume={() => onResume(device)}
                  onStop={() => onStop(device)}
                  isPaused={
                    playbackStatus[device.mediaDeviceInfo.deviceId].playbackState !==
                    PlaybackState.Playing
                  }
                />
              ))}
            </Flex>
          </>
        )}
      </Flex>
    </div>
  );
};

export default ActiveAudioDevicesList;
