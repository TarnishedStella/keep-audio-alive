export interface ChangelogItem {
  text: string;
  subItems?: string[];
}

export type ChangelogItemOrString = string | ChangelogItem;

export interface ChangelogEntry {
  version: string;
  features?: ChangelogItemOrString[];
  improvements?: ChangelogItemOrString[];
  bugFixes?: ChangelogItemOrString[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: '1.1.0',
    features: [
      {
        text: 'Auto Launch on Startup:',
        subItems: [
          'You can now set the app to launch automatically when you start your computer. No more forgetting to start it!',
          'If enabled, the app can be set to launch straight to the system tray.',
        ],
      },
    ],
  },
  // Add new versions here as you release them
  // {
  //   version: '1.2.0',
  //   features: [
  //     'Simple feature without sub-items',
  //     {
  //       text: 'Feature with sub-items',
  //       subItems: ['Sub-item 1', 'Sub-item 2'],
  //     },
  //   ],
  //   improvements: ['Improvement description'],
  //   bugFixes: ['Bug fix description'],
  // },
];

/**
 * Get the changelog entry for a specific version
 */
export function getChangelogForVersion(version: string): ChangelogEntry | undefined {
  return changelog.find((entry) => entry.version === version);
}

/**
 * Get the latest changelog entry
 */
export function getLatestChangelog(): ChangelogEntry | undefined {
  return changelog[0];
}
