import { createRoute } from '@tanstack/react-router';
import Settings from '@renderer/pages/settings/SettingsPage';
import HomePage from '@renderer/pages/home/HomePage';
import { rootRoute } from './root';

export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
});

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});
