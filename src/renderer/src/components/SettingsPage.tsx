import { ReactElement } from 'react';
import React, { useState } from 'react';
import { Switch, Select, Text } from '@radix-ui/themes';
import { Box, Flex, IconButton } from '@radix-ui/themes';

const idleTimes = [5, 10, 15, 30, 60]; // Idle detection times in minutes

interface Props {
  level: number;
}

const Settings: React.FunctionComponent<Props> = (props: Props): ReactElement => {
  const [isIdleDetectionEnabled, setIsIdleDetectionEnabled] = useState(false);
  const [idleDetectionTime, setIdleDetectionTime] = useState(idleTimes[0]);

  const handleToggleChange = () => {
    setIsIdleDetectionEnabled((prev) => !prev);
  };

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIdleDetectionTime(Number(event.target.value));
  };

  return (
    <div className="settings-container">
      <div className='settings-content'>
        <Text as="div" size="6" weight="regular" align="center">
          Settings
        </Text>
        <Flex direction="column" gap="1rem" width={"500px"}>
          <Box>
            <Text as="div" size="4" weight="regular">
              Idle Detection
            </Text>
            <Switch
              checked={isIdleDetectionEnabled}
              onCheckedChange={handleToggleChange}
              name="Enable Idle Detection"
            />
          </Box>

          {isIdleDetectionEnabled && (
            <Box>
              <Text as="div" size="4" weight="regular">
                Idle Detection Time (minutes)
              </Text>
              <Select.Root
                defaultValue={idleDetectionTime.toString()}
                onValueChange={() => handleDropdownChange}
              >
                <Select.Trigger
                  radius="large"
                  placeholder="Select Time"
                  className="selection-box-trigger"
                />
                <Select.Content position="popper">
                  {idleTimes.map((time) => (
                    <Select.Item key={time} value={time.toString()}>
                      {time} minutes
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>
          )}
        </Flex>
      </div>
    </div>
  );
};

export default Settings;
