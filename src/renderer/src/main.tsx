import './assets/main.css';
import '@radix-ui/themes/styles.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Theme } from '@radix-ui/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoute, createRouter, RouterProvider } from '@tanstack/react-router';
import { Route } from './routes/__root';
import { settingsRoute } from './routes/settings.lazy';

const indexRoute = createRoute({
  getParentRoute: () => Route,
  path: '/',
  component: App,
});

const routeTree = Route.addChildren([indexRoute, settingsRoute]);

const queryClient = new QueryClient();

const router = createRouter({ routeTree });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Theme appearance="dark" accentColor="violet">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Theme>
  </React.StrictMode>,
);
