import React from 'react';
import { Card, IconButton, Text } from '@radix-ui/themes';
import { PauseIcon, StopIcon, ResumeIcon } from '@radix-ui/react-icons';
import { ActiveAudioDevice } from '@renderer/types';
import { filterAudioDeviceLabel } from './helpers';

interface ActiveAudioDeviceCardProps {
  device: ActiveAudioDevice;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  isPaused: boolean;
}

const ActiveAudioDeviceCard: React.FC<ActiveAudioDeviceCardProps> = ({
  device,
  onPause,
  onResume,
  onStop,
  isPaused,
}) => {
  return (
    <Card key={device.mediaDeviceInfo.deviceId}>
      <div className="card-grid">
        <Text className="card-title" size={'2'}>
          {filterAudioDeviceLabel(device.mediaDeviceInfo.label) || 'Unknown Device'}
        </Text>
        <div className="card-buttons">
          <IconButton onClick={onStop} variant="soft" size="2" color="red">
            <StopIcon width="18" height="18" />
          </IconButton>

          {isPaused ? (
            <IconButton onClick={onResume} variant="soft" size="2" color="green">
              <ResumeIcon width="18" height="18" />
            </IconButton>
          ) : (
            <IconButton onClick={onPause} variant="soft" size="2" color="red">
              <PauseIcon width="18" height="18" />
            </IconButton>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ActiveAudioDeviceCard;
