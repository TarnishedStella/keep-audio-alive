import { useEffect, useState } from 'react';
import { IconButton, Spinner, Text } from '@radix-ui/themes';
import { DownloadIcon } from '@radix-ui/react-icons';
import useIpcListener from '@renderer/hooks';
import { Logger } from '@common/Logger';
import { showErrorToast, showSuccessToast } from '@renderer/common/ToastManager';
import * as Tooltip from '@radix-ui/react-tooltip';
import { UpdateInfo } from 'electron-updater';

enum UpdateState {
  NoUpdate,
  HasUpdate,
  UpdateDownloading,
}

function Version(): JSX.Element {
  const [currentVersion, setAppVersion] = useState<string>('');

  const [newVersion, setNewVersion] = useState<string>('');
  const [updateState, setUpdateState] = useState<UpdateState>(UpdateState.NoUpdate);

  useEffect(() => {
    const fetchCurrentVersion = async (): Promise<void> => {
      const appVersion = await window.api.getAppVersion();
      setAppVersion(appVersion);
    };

    fetchCurrentVersion();
  }, []);

  useIpcListener('update-available', (_event, updateInfo: UpdateInfo) => {
    Logger.info('update-available message received', updateInfo);
    setUpdateState(UpdateState.HasUpdate);
    showSuccessToast('An update is available');
    setNewVersion(updateInfo.releaseName ?? 'unknown');
  });

  useIpcListener('update-error', (_event, error: Error) => {
    Logger.error('update-error message received', error);
    showErrorToast(`Error handling auto update: ${error}`);
  });

  function _downloadAndInstallUpdate(): void {
    setUpdateState(UpdateState.UpdateDownloading);
    window.api.downloadUpdate();
  }

  function _renderDownloadingState(): JSX.Element {
    return <Spinner />;
  }

  function _renderUpdateButton(): JSX.Element {
    switch (updateState) {
      case UpdateState.NoUpdate:
        return <></>;
      case UpdateState.HasUpdate:
        return _renderHasUpdateState();
      case UpdateState.UpdateDownloading:
        return _renderDownloadingState();
    }
  }

  function _renderHasUpdateState(): JSX.Element {
    return (
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <IconButton size="1" onClick={_downloadAndInstallUpdate}>
              <DownloadIcon />
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className="TooltipContent" sideOffset={5}>
              Download and Install v{newVersion} Update
              <Tooltip.Arrow className="TooltipArrow" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }

  return (
    <div className="version-container">
      <Text className="version-text">KeepAudioAlive v{currentVersion}</Text>
      {_renderUpdateButton()}
    </div>
  );
}

export default Version;
