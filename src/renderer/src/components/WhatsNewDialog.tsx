import React from 'react';
import { Dialog, Flex, Text, Button, ScrollArea } from '@radix-ui/themes';
import { getChangelogForVersion, type ChangelogItemOrString } from '@renderer/data/changelog';

interface WhatsNewDialogProps {
  open: boolean;
  version: string;
  onClose: () => void;
}

const renderChangelogItem = (item: ChangelogItemOrString, index: number): React.ReactNode => {
  if (typeof item === 'string') {
    return (
      <li key={index} style={{ marginBottom: '0.5rem' }}>
        <Text size="2">{item}</Text>
      </li>
    );
  }

  return (
    <li key={index} style={{ marginBottom: '0.5rem' }}>
      <Text size="2">{item.text}</Text>
      {item.subItems && item.subItems.length > 0 && (
        <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
          {item.subItems.map((subItem, subIndex) => (
            <li key={subIndex} style={{ marginBottom: '0.25rem' }}>
              <Text size="2">{subItem}</Text>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const WhatsNewDialog: React.FC<WhatsNewDialogProps> = ({ open, version, onClose }) => {
  const changelog = getChangelogForVersion(version);

  if (!changelog) {
    return null;
  }

  return (
    <Dialog.Root open={open}>
      <Dialog.Content style={{ maxWidth: 500 }}>
        <Dialog.Title>
          <Flex align="center" gap="2">
            <Text size="6" weight="bold">
              v{version}
            </Text>
          </Flex>
        </Dialog.Title>

        <ScrollArea style={{ maxHeight: 400 }}>
          <Flex direction="column" gap="3" style={{ paddingRight: '1rem' }}>
            {changelog.features && changelog.features.length > 0 && (
              <Flex direction="column" gap="2">
                <Text size="3" weight="bold">
                  ✨ New Features
                </Text>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                  {changelog.features.map(renderChangelogItem)}
                </ul>
              </Flex>
            )}

            {changelog.improvements && changelog.improvements.length > 0 && (
              <Flex direction="column" gap="2">
                <Text size="3" weight="bold">
                  🔧 Improvements
                </Text>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                  {changelog.improvements.map(renderChangelogItem)}
                </ul>
              </Flex>
            )}

            {changelog.bugFixes && changelog.bugFixes.length > 0 && (
              <Flex direction="column" gap="2">
                <Text size="3" weight="bold">
                  🐛 Bug Fixes
                </Text>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                  {changelog.bugFixes.map(renderChangelogItem)}
                </ul>
              </Flex>
            )}
          </Flex>
        </ScrollArea>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="solid" onClick={onClose}>
              Got it!
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default WhatsNewDialog;
