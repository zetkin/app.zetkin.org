import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Hook to prevent navigation if there are unsaved changes.
 * @param isDirty - Boolean indicating if the form has unsaved changes.
 */
export const useUnsavedChanges = (isDirty: boolean) => {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmUrl, setConfirmUrl] = useState<null | string>(null);
  const bypassUnsavedChanges = useRef(false);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (!isDirty || bypassUnsavedChanges.current) {
        return;
      }

      setConfirmOpen(true);
      setConfirmUrl(url);

      // Cancel the route change
      router.events.emit(
        'routeChangeError',
        new Error('Route canceled'),
        router.asPath,
        { shallow: false }
      );
      throw 'Route canceled';
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [isDirty, router]);

  const onConfirm = async () => {
    if (confirmUrl) {
      bypassUnsavedChanges.current = true;
      await router.push(confirmUrl);
    }
  };

  const onCancel = () => {
    setConfirmOpen(false);
    setConfirmUrl(null);
  };

  return {
    confirmOpen,
    onCancel,
    onConfirm,
  };
};
