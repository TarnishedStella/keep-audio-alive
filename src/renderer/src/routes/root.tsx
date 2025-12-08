import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';
import WhatsNewDialog from '@renderer/components/WhatsNewDialog';
import { useWhatsNewCheck } from '@renderer/hooks/useWhatsNewCheck';

const RootComponent = (): JSX.Element => {
  const { showWhatsNew, currentVersion, dismissWhatsNew } = useWhatsNewCheck();

  return (
    <>
      <div>
        <Toaster />
      </div>
      <WhatsNewDialog open={showWhatsNew} version={currentVersion} onClose={dismissWhatsNew} />
      <Outlet />
    </>
  );
};

export const rootRoute = createRootRoute({
  component: RootComponent,
});
