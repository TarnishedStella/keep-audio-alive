import './assets/main.css';
import '@radix-ui/themes/styles.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './pages/home/App';
import { Theme } from '@radix-ui/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { Route } from './routes/__root';
import { indexRoute, settingsRoute } from './routes/settings.lazy';
import { Provider } from 'react-redux';
import store from './store';
import { AudioProvider } from './components/AudioContext';

const routeTree = Route.addChildren([indexRoute, settingsRoute]);

const queryClient = new QueryClient();

const router = createRouter({ routeTree });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Theme appearance="dark" accentColor="violet">
      <Provider store={store}>
        <AudioProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </AudioProvider>
      </Provider>
    </Theme>
  </React.StrictMode>,
);
