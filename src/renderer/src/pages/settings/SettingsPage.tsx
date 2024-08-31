import React, { ReactElement } from 'react';
import { Switch, Select, Text, IconButton, Box, Flex } from '@radix-ui/themes';
import {
  setInactivityTimer,
  setInactivityToggle,
  setRememberLastStateToggle,
} from '@renderer/pages/settings/settingsSlice';
import { useAppDispatch, useAppSelector } from '@renderer/hooks';
import {
  selectInactivityTimer,
  selectIsInactivityToggled,
  selectIsRememberLastStateToggled,
} from '@renderer/pages/settings/selectors';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

const idleTimes = [5, 10, 15, 30, 60]; // Idle detection times in minutes

// interface Props {}

const SettingsPage: React.FunctionComponent = (): ReactElement => {
  const navigate = useNavigate();

  const isIdleDetectionEnabled = useAppSelector(selectIsInactivityToggled);
  const idleDetectionTime = useAppSelector(selectInactivityTimer);

  const isRememberDeviceStateEnabled = useAppSelector(selectIsRememberLastStateToggled);

  const dispatch = useAppDispatch();

  function handleIdleDetectionToggle(): void {
    dispatch(setInactivityToggle(!isIdleDetectionEnabled));
  }

  function handleRememberDeviceStateToggle(): void {
    dispatch(setRememberLastStateToggle(!isRememberDeviceStateEnabled));
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
              <ArrowLeftIcon width="18" height="18" />
            </IconButton>
          </div>
          <Text as="div" size="5" weight="bold" align="center" style={{ flex: '1 1 auto' }}>
            Settings
          </Text>
          <div className="flex-1" />
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
          <Flex direction="column" gap="1rem" width="100%">
            <Flex>
              <Box flexGrow="1">
                <Text as="div" size="2" mb="0.5rem" weight="regular">
                  Idle Detection
                </Text>
                <Switch
                  checked={isIdleDetectionEnabled}
                  onCheckedChange={handleIdleDetectionToggle}
                  name="Enable Idle Detection"
                />
              </Box>

              {isIdleDetectionEnabled && (
                <Box flexGrow="5">
                  <Text as="div" size="2" mb="0.5rem" weight="regular">
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

            <Box>
              <Text as="div" size="2" mb="0.5rem" weight="regular">
                Remember Device State
              </Text>
              <Switch
                checked={isRememberDeviceStateEnabled}
                onCheckedChange={handleRememberDeviceStateToggle}
                name="Enable Idle Detection"
              />
            </Box>
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
