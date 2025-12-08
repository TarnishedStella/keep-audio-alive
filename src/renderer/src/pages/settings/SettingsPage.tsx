import React, { ReactElement, useEffect, useState } from 'react';
import { Switch, Select, Text, IconButton, Box, Flex, Tooltip } from '@radix-ui/themes';
import {
  setInactivityTimer,
  setInactivityToggle,
  setRememberLastStateToggle,
  setLaunchOnStartupToggle,
  setLaunchHiddenToggle,
} from '@renderer/pages/settings/settingsSlice';
import { useAppDispatch, useAppSelector } from '@renderer/hooks';
import {
  selectInactivityTimer,
  selectIsInactivityToggled,
  selectIsRememberLastStateToggled,
  selectIsLaunchOnStartupToggled,
  selectIsLaunchHiddenToggled,
} from '@renderer/pages/settings/selectors';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';

const idleTimes = [5, 10, 15, 30, 60]; // Idle detection times in minutes

// interface Props {}

const SettingsPage: React.FunctionComponent = (): ReactElement => {
  const navigate = useNavigate();

  const isIdleDetectionEnabled = useAppSelector(selectIsInactivityToggled);
  const idleDetectionTime = useAppSelector(selectInactivityTimer);

  const isRememberDeviceStateEnabled = useAppSelector(selectIsRememberLastStateToggled);
  const isLaunchOnStartupEnabled = useAppSelector(selectIsLaunchOnStartupToggled);
  const isLaunchHiddenEnabled = useAppSelector(selectIsLaunchHiddenToggled);

  const [showWarning, setShowWarning] = useState(false);

  // Check login item settings on page mount to detect if disabled via Task Manager
  useEffect(() => {
    const checkLoginItemSettings = async (): Promise<void> => {
      if (isLaunchOnStartupEnabled) {
        const loginSettings = await window.api.getLoginItemSettings();
        console.log('Login item settings:', loginSettings);
        // Show warning if we think it's enabled but system says it's not
        setShowWarning(!loginSettings.launchItems[0]?.enabled);
      }
    };

    checkLoginItemSettings();
  }, [isLaunchOnStartupEnabled]);

  async function handleLaunchOnStartupToggle(): Promise<void> {
    const newValue = !isLaunchOnStartupEnabled;
    dispatch(setLaunchOnStartupToggle(newValue));

    // Check system state after toggling to give immediate feedback
    if (newValue) {
      // Wait a bit for the system to update
      await new Promise(resolve => setTimeout(resolve, 1000));
      const loginSettings = await window.api.getLoginItemSettings();
      setShowWarning(!loginSettings.openAtLogin);
    } else {
      setShowWarning(false);
    }
  }

  function handleLaunchHiddenToggle(): void {
    dispatch(setLaunchHiddenToggle(!isLaunchHiddenEnabled));
  }

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

            <Flex>
              <Box flexGrow="1">
                <Flex align="center" gap="2" mb="0.5rem">
                  <Text as="div" size="2" weight="regular">
                    Launch on Startup
                  </Text>
                  {showWarning && (
                    <Tooltip content="Auto-launch is disabled in Task Manager. Enable it in Task Manager's Startup tab.">
                      <ExclamationTriangleIcon
                        width="16"
                        height="16"
                        color="var(--amber-11)"
                        style={{ cursor: 'help' }}
                      />
                    </Tooltip>
                  )}
                </Flex>
                <Switch
                  checked={isLaunchOnStartupEnabled}
                  onCheckedChange={handleLaunchOnStartupToggle}
                  name="Enable Launch on Startup"
                />
              </Box>

              {isLaunchOnStartupEnabled && (
                <Box flexGrow="5">
                  <Text as="div" size="2" mb="0.5rem" weight="regular">
                    Launch Hidden (to tray)
                  </Text>
                  <Switch
                    checked={isLaunchHiddenEnabled}
                    onCheckedChange={handleLaunchHiddenToggle}
                    name="Launch Hidden"
                  />
                </Box>
              )}
            </Flex>
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
