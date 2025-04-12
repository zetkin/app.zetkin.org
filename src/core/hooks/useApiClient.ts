import { useEffect } from 'react';
import { useRouter } from 'next/router';

import useEnv from './useEnv';

export default function useApiClient() {
  const { events } = useRouter();
  const { apiClient } = useEnv();

  useEffect(() => {
    const handleRouteChange = () => apiClient.cancelRequests();

    events.on('routeChangeStart', handleRouteChange);
    return () => events.off('routeChangeStart', handleRouteChange);
  }, [apiClient, events]);

  return apiClient;
}
