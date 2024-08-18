import { createLazyFileRoute, createRoute } from '@tanstack/react-router';
import { Route } from './__root';
import Settings from '@renderer/components/SettingsPage';

export const settingsRoute = createRoute({
  getParentRoute: () => Route,
  path: '/settings',
  component: Settings,
});

