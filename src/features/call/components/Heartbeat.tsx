'use client';

import { FC, useEffect } from 'react';

import { useApiClient } from 'core/hooks';
import { ApiClientError } from 'core/api/errors';

const oneMinute = 60_000;
const HEARTBEAT_FREQUENCY = oneMinute;

const Heartbeat: FC = () => {
  const apiClient = useApiClient();

  useEffect(() => {
    const heartbeatTimer = setInterval(async () => {
      try {
        await apiClient.get('/api/heartbeat');
      } catch (e) {
        if (e instanceof ApiClientError && e.status == 401) {
          location.href = '/login?redirect=/call';
        }
      }
    }, HEARTBEAT_FREQUENCY);

    return () => clearInterval(heartbeatTimer);
  }, []);

  return null;
};

export default Heartbeat;
