import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Select, IconButton } from '@radix-ui/themes';
import { ReloadIcon, PlusIcon } from '@radix-ui/react-icons';

interface AudioDeviceSelectorProps {
  onSelectDevice: (device: MediaDeviceInfo | null) => void;
  onStartAudio: () => void;
}

const AudioDeviceSelector: React.FC<AudioDeviceSelectorProps> = ({
  onSelectDevice,
  onStartAudio,
}) => {
  const queryClient = useQueryClient();

  const { data: audioDevices = [] } = useQuery({
    queryKey: ['audioDevices'],
    queryFn: listAudioDevices,
  });

  const handleDeviceChange = (selectedDeviceId: string): void => {
    const selectedDevice =
      audioDevices.find((device) => device.deviceId === selectedDeviceId) || null;
    onSelectDevice(selectedDevice);
  };

  function refreshMediaList(): void {
    queryClient.invalidateQueries({ queryKey: ['audioDevices'] });
  }

  return (
    <div className="selector-container">
      <div className="selection-box">
        <Select.Root size={'2'} onValueChange={handleDeviceChange}>
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
        <IconButton onClick={() => refreshMediaList()} variant="soft" size="2" color="gray">
          <ReloadIcon width="18" height="18" />
        </IconButton>
        <IconButton onClick={onStartAudio} variant="soft" size="2" color="green">
          <PlusIcon width="18" height="18" />
        </IconButton>
      </div>
    </div>
  );
};

async function listAudioDevices(): Promise<MediaDeviceInfo[]> {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === 'audiooutput');
}

function filterAudioDeviceLabel(label: string): string {
  return label.replace(/\s*\([a-fA-F0-9]+:[a-fA-F0-9]+\)$/, '');
}

export default AudioDeviceSelector;
