'use client';

import { FC, useEffect } from 'react';

import { useApiClient } from 'core/hooks';

const Heartbeat: FC = () => {
  const apiClient = useApiClient();

  useEffect(() => {
    const heartbeatTimer = setInterval(async () => {
      await apiClient.get('/api/heartbeat');
    }, 5000);

    return () => clearInterval(heartbeatTimer);
  }, []);

  return null;
};

export default Heartbeat;
