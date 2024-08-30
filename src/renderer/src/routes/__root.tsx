import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';

export const Route = createRootRoute({
  component: () => (
    <>
      <div>
        <Toaster />
      </div>

      <Outlet />
    </>
  ),
});
