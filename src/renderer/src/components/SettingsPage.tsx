import { ReactElement } from 'react';
import React from 'react';
import { Switch, Select, Text } from '@radix-ui/themes';
import { Box, Flex } from '@radix-ui/themes';
import { setInactivityTimer, setInactivityToggle } from '@renderer/pages/settings/settingsSlice';
import { useAppDispatch, useAppSelector } from '@renderer/hooks';
import {
  selectInactivityTimer,
  selectIsInactivityToggled,
} from '@renderer/pages/settings/selectors';

const idleTimes = [5, 10, 15, 30, 60]; // Idle detection times in minutes

interface Props {
  level: number;
}

const Settings: React.FunctionComponent<Props> = (props: Props): ReactElement => {
  const isToggled = useAppSelector(selectIsInactivityToggled);
  const idleDetectionTime = useAppSelector(selectInactivityTimer);
  const dispatch = useAppDispatch();

  function handleToggleChange() {
    dispatch(setInactivityToggle(!isToggled));
  }

  function handleDropdownChange(value: string) {
    dispatch(setInactivityTimer(Number(value)));
  }

  return (
    <div className="settings-container">
      <div className="settings-content">
        <Text as="div" size="6" weight="regular" align="center" style={{ margin: '1rem' }}>
          Settings
        </Text>
        <Flex direction="column" gap="1rem" width={'500px'}>
          <Box>
            <Text as="div" size="2" weight="regular">
              Idle Detection
            </Text>
            <Switch
              checked={isToggled}
              onCheckedChange={handleToggleChange}
              name="Enable Idle Detection"
            />
          </Box>

          {isToggled && (
            <Box>
              <Text as="div" size="2" weight="regular">
                Idle Detection Time
              </Text>
              <Select.Root
                defaultValue={idleDetectionTime.toString()}
                onValueChange={(value) => handleDropdownChange(value)}
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
