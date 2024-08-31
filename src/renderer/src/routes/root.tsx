import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <div>
        <Toaster />
      </div>
      <Outlet />
    </>
  ),
});
