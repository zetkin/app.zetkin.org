'use client';

import { FC, useEffect } from 'react';

import { useApiClient } from 'core/hooks';

const oneMinute = 60_000;
const HEARTBEAT_FREQUENCY = oneMinute;

const Heartbeat: FC = () => {
  const apiClient = useApiClient();

  useEffect(() => {
    const heartbeatTimer = setInterval(async () => {
      await apiClient.get('/api/heartbeat');
    }, HEARTBEAT_FREQUENCY);

    return () => clearInterval(heartbeatTimer);
  }, []);

  return null;
};

export default Heartbeat;
