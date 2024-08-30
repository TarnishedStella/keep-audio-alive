import { createRoute } from '@tanstack/react-router';
import { Route } from './__root';
import Settings from '@renderer/pages/settings/SettingsPage';
import HomePage from '@renderer/pages/home/HomePage';

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
