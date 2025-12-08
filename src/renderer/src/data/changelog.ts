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
  // Add new versions at the top
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
  {
    version: '1.1.0',
    features: [
      {
        text: 'Auto Launch on Startup',
        subItems: [
          'Toggle to enable/disable launching the app when the system starts. No more forgetting to start it!',
          'Option to launch hidden directly to the system tray',
        ],
      },
      {
        text: "What's New Dialog",
        subItems: [
          'One-time dialog showing release notes after updates.',
          "You're looking at it right now :3",
        ],
      },
    ],
    bugFixes: [
      'Addressed a potential race condition that could cause the UI to miss an update notification',
    ],
  },
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
