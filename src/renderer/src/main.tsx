import './assets/main.css';
import '@radix-ui/themes/styles.css';

import ReactDOM from 'react-dom/client';
import { Theme } from '@radix-ui/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { Provider } from 'react-redux';

import store from './store';
import { AudioProvider } from './components/AudioContext';
import { rootRoute } from './routes/root';
import { indexRoute, settingsRoute } from './routes/page-routes';
import { useElectronLog } from './hooks/useElectronLogger';

const memoryHistory = createMemoryHistory({
  initialEntries: ['/'], // Pass your initial url
});

const routeTree = rootRoute.addChildren([indexRoute, settingsRoute]);

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  history: memoryHistory,
});

useElectronLog();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Theme appearance="dark" accentColor="violet">
    <Provider store={store}>
      <AudioProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AudioProvider>
    </Provider>
  </Theme>,
);
