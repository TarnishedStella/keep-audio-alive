import { createRoute } from '@tanstack/react-router';
import Settings from '@renderer/pages/settings/SettingsPage';
import HomePage from '@renderer/pages/home/HomePage';
import { Route } from './__root';

export const settingsRoute = createRoute({
  getParentRoute: () => Route,
  path: '/settings',
  component: Settings,
});

export const indexRoute = createRoute({
  getParentRoute: () => Route,
  path: '/',
  component: HomePage,
});
