import { ReactElement } from 'react';
import React from 'react';
import { Switch, Select, Text, IconButton } from '@radix-ui/themes';
import { Box, Flex } from '@radix-ui/themes';
import { setInactivityTimer, setInactivityToggle } from '@renderer/pages/settings/settingsSlice';
import { useAppDispatch, useAppSelector } from '@renderer/hooks';
import {
  selectInactivityTimer,
  selectIsInactivityToggled,
} from '@renderer/pages/settings/selectors';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

const idleTimes = [5, 10, 15, 30, 60]; // Idle detection times in minutes

// interface Props {}

const Settings: React.FunctionComponent = (): ReactElement => {
  const navigate = useNavigate();

  const isToggled = useAppSelector(selectIsInactivityToggled);
  const idleDetectionTime = useAppSelector(selectInactivityTimer);
  const dispatch = useAppDispatch();

  function handleToggleChange(): void {
    dispatch(setInactivityToggle(!isToggled));
  }

  function handleDropdownChange(value: string): void {
    dispatch(setInactivityTimer(Number(value)));
  }

  return (
    <div className="main-container">
      <div className="component-container">
        <div className="settings-title">
          <div className="settings-back-button-container">
            <IconButton variant="soft" size="2" color="gray" onClick={() => navigate({ to: '/' })}>
              <ArrowLeftIcon width="18" height="18"></ArrowLeftIcon>
            </IconButton>
          </div>
          <Text as="div" size="5" weight="bold" align="center" style={{ flex: '1 1 auto' }}>
            Settings
          </Text>
          <div className="settings-back-button-counterweight"></div>
        </div>

        <div
          className="settings-card"
          style={{
            width: '100%',
            padding: '1rem',
            background: 'var(--gray-a2)',
            borderRadius: 'var(--radius-3)',
          }}
        >
          <Flex direction="column" gap="1rem" width={'100%'}>
            <Flex>
              <Box flexGrow={'1'}>
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
                <Box flexGrow={'5'}>
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

            {/* <Flex justify={'center'}>
              <button onClick={() => navigate({ to: '/' })}>Done</button>
            </Flex> */}
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default Settings;
